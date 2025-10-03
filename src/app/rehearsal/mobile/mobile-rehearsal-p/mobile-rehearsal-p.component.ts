import {CommonModule} from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {ChordsGridComponent} from "../chords-grid/chords-grid.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {PartLineComponent} from "../part-line/part-line.component";
import {PartTabsComponent} from "../part-tabs/part-tabs.component";
import {SampleMapComponent} from "../sample-map/sample-map.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SampleCacheService} from "../../../sample/samples-cache.service";
import {error} from "../../../utils";
import {SongRepository} from "../../../song/song-repository";
import {KeyboardComponent} from "../../../keyboard/keyboard.component";
import * as Tone from "tone";
import {Time} from "../../../time";
import keyboardReducer from "../../../keyboard/reducer";
import {KeyboardState} from "../../../keyboard/type";

@Component({
  selector: 'app-mobile-rehearsal-p',
  standalone: true,
  imports: [
    RythmBarComponent,
    CommonModule,
    FormsModule,
    StructureMapComponent,
    PartTabsComponent,
    PartLineComponent,
    SampleMapComponent,
    ChordsGridComponent,
    KeyboardComponent,
  ],
  templateUrl: './mobile-rehearsal-p.component.html',
  styleUrl: './mobile-rehearsal-p.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalPComponent extends MobileRehearsal implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  keyboardStatesByTrackIndex: KeyboardState[] = [];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
    sampleCacheService: SampleCacheService,
    songRepository: SongRepository,
  ) {
    super(changeDetectorRef, activatedRoute, title, sampleCacheService, songRepository)
  }

  ngOnInit() {
    const entry = this.requireSongEntry();
    this.structure = entry.structure
    this.recording = entry.recording
    this.scheduleKeyboardNotes();
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  override async playSong(): Promise<void> {
    if (!this.sampleIsLoaded) {
      if (!this.recording) {
        error('Aucun enregistrement (Recording)')
      }

      const audioFile = this.sampleCacheService.get(this.recording.name)
      if (audioFile) {
        await this.playAudioFile(audioFile)
      } else {
        this.fileInput?.nativeElement.click();
      }
      return;
    }
    await super.playSong();
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return patternInStructure.structure.getPatternColor(patternInStructure).toString()
  }

  private scheduleKeyboardNotes() {
    // Source : https://github.com/imagicbell/piano-app/blob/a22138d05361e1ebf2571eed2949b0e4544c2781/src/features/midiplayer/index.js
    this.recording?.midi?.tracks.forEach((track, trackIndex) => {
      track.notes.forEach((note, noteIndex) => {
        console.log(`note`, note.name);
        const warpTime = this.recording?.getWrappedTime(Time.fromValue(note.time))
        if (warpTime) {
          Tone.Transport.schedule(time => {
            this.keyboardStatesByTrackIndex[trackIndex] = keyboardReducer(this.keyboardStatesByTrackIndex[trackIndex], {
              type: 'ACTIVE_KEY',
              key: note.name,
            })
            console.log('keyboardState after ACTIVE_KEY', this.keyboardStatesByTrackIndex[trackIndex]);
          }, warpTime.toSeconds());


          const endWarpTime = this.recording?.getWrappedTime(Time.fromValue(note.time + note.duration))
          if (!endWarpTime) {
            throw new Error(`WarpTime end inconnu pour la note MIDI ${note.name} de time=${note.time} et de duration=${note.duration}`);
          }
          Tone.Transport.schedule(time => {
            this.keyboardStatesByTrackIndex[trackIndex] = keyboardReducer(this.keyboardStatesByTrackIndex[trackIndex], {
              type: 'DEACTIVE_KEY',
              key: note.name,
            })
            console.log('keyboardState after DEACTIVE_KEY', this.keyboardStatesByTrackIndex[trackIndex]);
          }, endWarpTime.toSeconds());

        } else {
          console.error('WarpTime inconnu pour la note MIDI', note);
        }
      });
    });
  }

  protected override resetStates() {
    super.resetStates();
    this.resetKeyboardStates();
  }

  private resetKeyboardStates() {
    this.keyboardStatesByTrackIndex.forEach(keyboardState => keyboardState.activeKeys = []);
  }

}
