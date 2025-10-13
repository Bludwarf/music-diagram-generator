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
import {ChordsGridComponent} from "../chords-grid/chords-grid.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {PartLineComponent} from "../part-line/part-line.component";
import {PartTabsComponent} from "../part-tabs/part-tabs.component";
import {SampleMapComponent} from "../sample-map/sample-map.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SampleCacheService} from "../../../sample/samples-cache.service";
import {error, sequence} from "../../../utils";
import {SongRepository} from "../../../song/song-repository";
import {KeyboardComponent} from "../../../keyboard/keyboard.component";
import * as Tone from "tone";
import {BeatTime, Position, PositionedElement} from "../../../time";
import keyboardReducer from "../../../keyboard/reducer";
import {KeyboardState} from "../../../keyboard/type";
import {BarNumber0Indexed, Chord, Note, OctavedNote} from "../../../notes";
import {SheetMusicComponent} from "../../../sheet-music/sheet-music.component";
import {MAX_MIDI, MIN_MIDI} from "../../../keyboard/notes";
import {MidiNote} from "../../../recording/recording";

@Component({
  selector: 'app-mobile-rehearsal-p-osmd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StructureMapComponent,
    PartTabsComponent,
    PartLineComponent,
    SampleMapComponent,
    ChordsGridComponent,
    KeyboardComponent,
    SheetMusicComponent,
  ],
  templateUrl: './mobile-rehearsal-p-osmd.component.html',
  styleUrl: './mobile-rehearsal-p-osmd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalPOsmdComponent extends MobileRehearsal implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  keyboardState?: KeyboardState;
  musicXml?: string;

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

    this.loadMusicXML();
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
    const recording = this.recording;
    if (recording) {
      const midi = recording.midi;
      if (midi) {
        let lowerMidiValue = MAX_MIDI
        let higherMidiValue = MIN_MIDI

        // Tone.Transport.PPQ = midi.header.ppq; // TODO cf. https://github.com/tonejs/tone.js/wiki/Time#ticks
        midi.tracks.forEach(track => {
          track.notes.forEach(note => {
            if (note.durationTicks <= 0) {
              console.warn(`On ignore cette note car sa durée est invalide`, note)
              return;
            }

            const beatTime = BeatTime.fromMidiTicks(note.ticks, midi.header.ppq);
            const secTime = recording.getSecTime(beatTime);
            if (secTime) {
              Tone.Transport.schedule(time => {
                this.keyboardState = keyboardReducer(this.keyboardState, {
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
              Tone.Transport.schedule(time => {
                this.keyboardState = keyboardReducer(this.keyboardState, {
                  type: 'DEACTIVE_KEY',
                  key: note.name,
                })
              }, endSecTime.value);
            } else {
              console.error('WarpTime inconnu pour la note MIDI', note);
            }

            lowerMidiValue = Math.min(lowerMidiValue, note.midi)
            higherMidiValue = Math.max(higherMidiValue, note.midi)
          });
        });
      }
    }
  }

  get currentMidiNotesElement(): PositionedElement | undefined {
    // return this.currentSectionInStructure;
    return undefined; // Pour avoir toutes les notes du morceau
  }

  get currentMidiNotes(): MidiNote[] {
    return this.getMidiNotesFrom(this.currentMidiNotesElement);
  }

  private getMidiNotesFrom(element: PositionedElement | undefined) {
    const recording = this.recording;
    const midi = recording?.midi
    if (!recording || !midi) {
      return []
    }

    const startTicks = element ? recording.getBeatTimeAt(element.startPosition)?.toMidiTicks(midi.header.ppq) : undefined;
    const endTicks = element ? recording.getBeatTimeAt(element.endPosition)?.toMidiTicks(midi.header.ppq) : undefined;
    return midi.tracks.flatMap(track =>
      track.notes.filter(note => startTicks !== undefined && endTicks !== undefined ? startTicks <= note.ticks && note.ticks < endTicks : true)
    );
  }

  get lowerOctavedNote(): OctavedNote | undefined {
    return this.getExtremeOctavedNote('down')
  }

  get higherOctavedNote(): OctavedNote | undefined {
    return this.getExtremeOctavedNote('up')
  }

  get keyHeightInPx(): number | undefined {
    const lowerOctavedNote = this.lowerOctavedNote;
    const higherOctavedNote = this.higherOctavedNote;
    if (lowerOctavedNote && higherOctavedNote) {
      const midiRange = higherOctavedNote.midi - lowerOctavedNote.midi;
      const factor = 72 / 55 // 72px pour 55 notes semble convenir pour l'affichage mobile // TODO le déduire des dimensions d'une touche
      return midiRange * factor
    } else {
      return undefined
    }
  }

  get keyboardHeight(): string | undefined {
    const heightInCm = this.keyHeightInPx
    return heightInCm ? `${heightInCm}px` : undefined;
  }

  get markedOctavedNotes(): OctavedNote[] {
    // // V1 : la fondamentale de l'accord courant
    // const root = this.currentChord?.root;
    // if (!root) {
    //   return []
    // }
    //
    // const octaves = sequence(9)
    // return octaves.flatMap(octave => [
    //   new OctavedNote(root, octave)
    // ])

    // V2 : toutes les notes courante
    return this.getMidiNotesFrom(this.currentPatternInStructure)
      .map(midiNote => OctavedNote.fromMidi(midiNote.midi))
  }

  private loadMusicXML() {
    const musicXmlString = this.recording?.musicXmlString;
    if (musicXmlString) {
      this.musicXml = musicXmlString
      // const musicXmlContent = await loadMusicXml(musicXmlString);
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
          midi.tracks.forEach(track => {
            const currentNotes = track.notes.filter(note => note.ticks <= ticks && ticks < note.ticks + note.durationTicks);
            currentNotes.forEach(note => {
              if (note.durationTicks <= 0) {
                console.warn(`On ignore cette note car sa durée est invalide`, note)
                return;
              }
              this.keyboardState = keyboardReducer(this.keyboardState, {
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
    if (this.keyboardState) {
      this.keyboardState.activeKeys = [];
    }
  }

  private getExtremeOctavedNote(direction: 'down' | 'up'): OctavedNote | undefined {
    const midiNotes = this.currentMidiNotes;
    if (midiNotes.length) {
        const method = direction === 'down' ? Math.min : Math.max;
        const minMidi = method(...midiNotes.map(note => note.midi));
        return OctavedNote.fromMidi(minMidi);
    }
    return undefined;
  }

  override onBarChange(currentBar: BarNumber0Indexed, currentChord: Chord | undefined) {
    if (currentChord) {
      const recording = this.recording;
      if (recording) {
        const beatTime = recording.getBeatTimeAt(new Position(currentBar)); // TODO passer beatTime plutôt que currentBar
        const beatTimeEnd = recording.getBeatTimeAt(new Position(currentBar + 1));
        const midi = recording.midi;
        if (beatTime && beatTimeEnd && midi) {
          const startTicks = beatTime.toMidiTicks(midi.header.ppq);
          const endTicks = beatTimeEnd.toMidiTicks(midi.header.ppq);
          return;
        }
      }
    }
  }
}
