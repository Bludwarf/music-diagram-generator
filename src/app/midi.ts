// TODO type pour le MIDI : https://github.com/Tonejs/Midi
import {BeatTime, TimeSignature} from "./time";
import {BarNumber0Indexed} from "./notes";

export type Midi = {
    header: MidiHeader;
    tracks: MidiTrack[]
};

export type MidiHeader = {
    ppq: number;
    timeSignatures: MidiTimeSignature[];
}

export type MidiTimeSignature = {
    ticks: number;
    timeSignature: TimeSignature;
    /** 0-indexée */
    measures: BarNumber0Indexed;
}

export type MidiTrack = {
    notes: MidiNote[];
}

export type MidiNote = {
    duration: number;
    durationTicks: number;
    midi: number;
    name: string;
    ticks: number;
    time: number;
    velocity: number;
}

type MidiTimeSignatureField = keyof MidiTimeSignature & ("ticks" | "measures");

export class MidiWrapper {
    constructor(
        readonly midi: Midi,
    ) {

    }

    getStartBeatTime(note: MidiNote): BeatTime {
        return BeatTime.fromMidiTicks(note.ticks, this.midi.header.ppq);
    }

    getEndBeatTime(note: MidiNote): BeatTime {
        return BeatTime.fromMidiTicks(note.ticks + note.durationTicks, this.midi.header.ppq);
    }

    getTimeSignature(fieldKey: MidiTimeSignatureField, fieldValue: number): MidiTimeSignature {
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature[fieldKey] as number > fieldValue);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }
}

// On ne peut pas utiliser BeatTime, car il utilise une signature rythmique fixe
export function addBarsToTicks(ticks: number, bars: number, timeSignature: TimeSignature, ppq: number) {
    return ticks + bars * timeSignature[0] * ppq;
}
