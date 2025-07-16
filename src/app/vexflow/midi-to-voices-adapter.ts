import {Injectable} from "@angular/core";
import {TextNote, Voice} from "vexflow";
import {CustomStaveNote} from "./custom-stave-note";
import {TextNoteStruct} from "vexflow/build/types/src/textnote";
import {Chord, OctavedNote} from "../notes";
import {MidiNote} from "../recording/recording";
import {MobileRehearsalPListeners} from "../rehearsal/mobile/mobile-rehearsal-p/mobile-rehearsal-p.component";

@Injectable({
  providedIn: 'root'
})
export class MidiToVoicesAdapter {
  getVoices(midiNotes: MidiNote[], ppq: number, chord: Chord | undefined, jianpuMode: boolean, onClickTicksListener?: (ticks: number) => any, mobileRehearsalPListeners?: MobileRehearsalPListeners): Voice[] {
    const customStaveNotes = this.toCustomStaveNote(midiNotes, ppq, chord, jianpuMode, onClickTicksListener, mobileRehearsalPListeners);
    return [

      // Accords
      new Voice({
        numBeats: 4,
        beatValue: 4,
      }).addTickables([
        new TextNote({
          text: chord ? chord.toString() : 'Accord ?',
          duration: '1'
        }).setJustification(TextNote.Justification.LEFT),
      ]),

      // Notes
      new Voice({
        numBeats: 4,
        beatValue: 4,
      }).addTickables(customStaveNotes),

      // TODO si besoin nom des notes, ou fonction
      // // Paroles
      // new Voice({
      //   numBeats: 4,
      //   beatValue: 4,
      // }).addTickables([
      //   lyricTextNote({text: 'Do', duration: '8'}),
      //   lyricTextNote({text: 'sol', duration: 'q'}),
      //   lyricTextNote({text: 'sol', duration: 'q'}),
      //   lyricTextNote({text: 'sol', duration: 'q'}),
      //   lyricTextNote({text: 'sol', duration: '8'}),
      // ]),
    ];
  }

  private toCustomStaveNote(midiNotes: MidiNote[], ppq: number, chord: Chord | undefined, jianpuMode: boolean,  onClickTicksListener?: (ticks: number) => any, mobileRehearsalPListeners?: MobileRehearsalPListeners): CustomStaveNote[] {
    if (midiNotes.length === 0) {
      return [
        new CustomStaveNote({keys: ['r/3'], duration: 'wr'}),
      ]
    }

    // TODO notes sur le même temp
    const midiNotesByTicks: Record<number, MidiNote[]> = {};
    midiNotes.forEach(midiNote => {
      const midiNotesAtTicks = midiNotesByTicks[midiNote.ticks] || [];
      midiNotesAtTicks.push(midiNote);
      midiNotesByTicks[midiNote.ticks] = midiNotesAtTicks
    });

    // TODO on se cale sur la maquette pour l'instant
    const draftDurationStrings = [
      '8',
      'q',
      'q',
      'q',
      '8',
    ];

    const customStaveNotes = Object.keys(midiNotesByTicks).map((ticksString, index) => {
      const ticks = +ticksString; // TODO pas plus simple ?
      const midiNotesAtTicks = midiNotesByTicks[ticks];
      const keys = midiNotesAtTicks
          .map(midiNoteAtTicks => OctavedNote.fromMidi(midiNoteAtTicks.midi))
          .map(octavedNote => jianpuMode && chord ? this.jianpuNumberToKey(this.toJianpuNumber(octavedNote, chord)) : this.toKey(octavedNote))
      // TODO utilitaire
      // TODO il peut y avoir plusieurs voix en même temps; pour l'instant on prend la première note
      const durationTicks = midiNotesAtTicks[0].durationTicks;
      const duration = draftDurationStrings[index] ?? this.toDuration(durationTicks, ppq);
      const customStaveNote = new CustomStaveNote({keys, duration});
      if (onClickTicksListener) {
        customStaveNote.onClickListener = () => {
          onClickTicksListener(midiNotesAtTicks[0].ticks)
        }
        if (mobileRehearsalPListeners) {
          // TODO on devrait activer notehead, car on peut avoir plusieurs notes sur la même StaveNote
          mobileRehearsalPListeners.onTicksChangeListeners.push((currentTicks: number) => {
            if (ticks <= currentTicks && currentTicks < ticks + durationTicks) {
              customStaveNote.activate();
            } else {
              customStaveNote.deactivate();
            }
          })
        }
      }
      return customStaveNote;
    });

    return draftDurationStrings.map((durationString, index) => {
      const customStaveNote = customStaveNotes[index];
      if (customStaveNote) {
        return customStaveNote;
      }
      return new CustomStaveNote({
        keys: ['r/3'],
        duration: durationString + 'r',
      })
    })
  }

  private toDuration(midiDuration: number, ppq: number): string {
    if (midiDuration === ppq) {
      // TODO pas bon : il faut d'abord séparer les voix avant de calculer les StaveNotes => s'inspirer de OSMD
      // Exemple : VexFlowConverter.StaveNote utilisée par VexFlowMeasure.graphicalMeasureCreatedCalculations
      // Création par la ligne graphicalStaffEntry.graphicalVoiceEntries.push(gve) dans MusicSheetCalculator.createGraphicalMeasure
    }
    return '8' // TODO par défaut ?
  }

  private toJianpuNumber(octavedNote: OctavedNote, chord: Chord): JianpuNumber {
    const relativeNote = octavedNote.note.relativeTo(chord.root);
    switch (relativeNote.value) {
      // FIXME la valeur dépend également de la nature de l'accord (degrée)
      case 0:
        return 1;
      case 1:
      case 2:
        return 2;
      case 3:
      case 4:
        return 3;
      case 5:
      case 6:
        return 4;
      case 7:
        return 5;
      case 8:
      case 9:
        return 6;
      case 10:
      case 11:
        return 7;
      default:
        throw new Error('Unknown Jianpu number for ' + relativeNote.value);
    }
  }

  private jianpuNumberToKey(jianpuNumber: JianpuNumber): string {
    switch (jianpuNumber) {
      // TODO facto avec Note pour éviter de duplique le nom des notes
      case 1:
        return 'A/4';
      case 2:
        return 'B/4';
      case 3:
        return 'C/5';
      case 4:
        return 'D/5';
      case 5:
        return 'E/5';
      case 6:
        return 'F/5';
      case 7:
        return 'G/5';
    }
  }

  private toKey(octavedNote: OctavedNote): string {
    return `${octavedNote.note}/${octavedNote.octave}`;
  }
}

type JianpuNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function lyricTextNote(noteStruct: TextNoteStruct): TextNote {
  return new TextNote(noteStruct)
    .setJustification(TextNote.Justification.CENTER)
    .setLine(9);
}
