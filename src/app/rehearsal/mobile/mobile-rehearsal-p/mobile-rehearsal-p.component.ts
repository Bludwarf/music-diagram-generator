import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {BeatTime, Position} from "../../../time";
import keyboardReducer from "../../../keyboard/reducer";
import {KeyboardRange, KeyboardState} from "../../../keyboard/type";
import {OctavedNote} from "../../../notes";
import {KeyboardAdapter} from "../../../keyboard/keyboard-adapter";
import {ToneAdapter} from "../../../tonejs/tone-adapter";

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
  override fileInput?: ElementRef<HTMLInputElement>;

  keyboardStatesByTrackIndex: (KeyboardState | undefined)[] = [];
  keyboardRangeByTrackIndex: KeyboardRange[] = [];

  constructor(
    toneAdapter: ToneAdapter,
    activatedRoute: ActivatedRoute,
    title: Title,
    sampleCacheService: SampleCacheService,
    songRepository: SongRepository,
    private readonly keyboardAdapter: KeyboardAdapter,
  ) {
    super(toneAdapter, activatedRoute, title, sampleCacheService, songRepository)
  }

  ngOnInit() {
    this.onInit()
  }

  ngOnDestroy() {
    this.onDestroy()
  }

  protected override scheduleAll() {
    super.scheduleAll();
    this.scheduleKeyboardNotes();
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
    const recording = this.recording;
    if (recording) {
      const midi = recording.midi;
      if (midi) {
        // Tone.Transport.PPQ = midi.header.ppq; // TODO cf. https://github.com/tonejs/tone.js/wiki/Time#ticks
        midi.tracks.forEach((track, trackIndex) => {
          track.notes.forEach((note, noteIndex) => {
            if (note.durationTicks <= 0) {
              console.warn(`On ignore cette note car sa durée est invalide`, note)
              return;
            }

            const beatTime = BeatTime.fromMidiTicks(note.ticks, midi.header.ppq);
            const secTime = recording.getSecTime(beatTime);
            if (secTime) {
              this.toneAdapter.schedule(time => {
                this.keyboardStatesByTrackIndex[trackIndex] = keyboardReducer(this.keyboardStatesByTrackIndex[trackIndex], {
                  type: 'ACTIVE_KEY',
                  key: note.name,
                })
              }, secTime.value);
              const endBeatTime = BeatTime.fromMidiTicks(note.ticks + note.durationTicks, midi.header.ppq);
              const endSecTime = recording.getSecTime(endBeatTime);
              if (!endSecTime) {
                throw new Error(`WarpTime end inconnu pour la note MIDI ${note.name} ticks=${note.ticks} durationTicks=${note.durationTicks}`);
              }
              if (endSecTime.value === secTime.value) {
                throw new Error(`La note ${note.name} devrait durer un minimum de temps (cf. log ticks=${note.ticks})`);
              }
              this.toneAdapter.schedule(time => {
                this.keyboardStatesByTrackIndex[trackIndex] = keyboardReducer(this.keyboardStatesByTrackIndex[trackIndex], {
                  type: 'DEACTIVE_KEY',
                  key: note.name,
                })
              }, endSecTime.value);
            } else {
              console.error('WarpTime inconnu pour la note MIDI', note);
            }
          });

          this.keyboardRangeByTrackIndex[trackIndex] = {
            lowerKey: this.getLowerKey(trackIndex),
            higherKey: this.getHigherKey(trackIndex),
          }
        });
      }
    }
  }

  protected override resetStates(selectedPosition?: Position) {
    super.resetStates();
    this.resetKeyboardStates();

    if (!this.playing && selectedPosition) {
      this.activateCurrentMidiNotes(selectedPosition);
    }
  }

  private activateCurrentMidiNotes(position: Position) {
    const recording = this.recording;
    if (recording) {
      const midi = recording.midi;
      if (midi) {
        const ticks = recording.getBeatTimeAt(position)?.toMidiTicks(midi.header.ppq);
        if (ticks !== undefined) {
          midi.tracks.forEach((track, trackIndex) => {
            const currentNotes = track.notes.filter(note => note.ticks <= ticks && ticks < note.ticks + note.durationTicks);
            currentNotes.forEach((note, noteIndex) => {
              if (note.durationTicks <= 0) {
                console.warn(`On ignore cette note car sa durée est invalide`, note)
                return;
              }
              this.keyboardStatesByTrackIndex[trackIndex] = keyboardReducer(this.keyboardStatesByTrackIndex[trackIndex], {
                type: 'ACTIVE_KEY',
                key: note.name,
              })
            });
          });
        }
      }
    }
  }

  private resetKeyboardStates() {
    this.keyboardStatesByTrackIndex.forEach(keyboardState => {
      if (keyboardState) {
        keyboardState.activeKeys = [];
      }
    });
  }

  getLowerKey(trackIndex: number): string {
    return this.getExtremeKey(trackIndex, 'down', 'A0');
  }

  getHigherKey(trackIndex: number): string {
    return this.getExtremeKey(trackIndex, 'up', 'C8');
  }

  private getExtremeKey(trackIndex: number, direction: 'down' | 'up', defaultKey: string) {
    const midi = this.recording?.midi;
    if (midi) {
      const midiTrack = midi.tracks[trackIndex];
      if (midiTrack) {
        const method = direction === 'down' ? Math.min : Math.max;
        const minMidi = method(...midiTrack.notes.map(note => note.midi));
        const octavedNote = OctavedNote.fromMidi(minMidi);
        return this.keyboardAdapter.adaptExtremeNoteName(octavedNote, direction);
      }
    }
    return defaultKey;
  }

}
