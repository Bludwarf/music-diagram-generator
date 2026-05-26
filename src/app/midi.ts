// TODO type pour le MIDI : https://github.com/Tonejs/Midi
import {BeatTime, TimeSignature} from "./time";
import {error} from "./utils";

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
    measures: number;
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

function beatTimeToMidiTicks(beatTime: BeatTime, ppq: number): number {
    return beatTime.value * ppq;
}

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

    getTimeSignature(measure: number): TimeSignature {
        // TODO optimisation si une seule time signature ?
        const beatTime = this.getBeatTimeAt(measure) ?? error(`Impossible de trouver le BeatTime de la ${measure + 1}${measure > 0 ? "e" : "ère"} mesure`);
        const ticks = beatTimeToMidiTicks(beatTime, this.midi.header.ppq);
        return this.getMidiTimeSignature(ticks).timeSignature;
    }

    getBeatTimeAt(measure: number): BeatTime | undefined {
        const currentTimeSignature = this.getMidiTimeSignatureAt(measure);
        const currentTimeSignatureBeatTime = BeatTime.fromMidiTicks(currentTimeSignature.ticks, this.midi.header.ppq);
        return this.getBeatTimeWithTimeSignatureAt(currentTimeSignature, currentTimeSignatureBeatTime, measure);
    }

    private getMidiTimeSignatureAt(measure: number): MidiTimeSignature {
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignature
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.measures > measure);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }

    private getBeatTimeWithTimeSignatureAt(currentTimeSignature: MidiTimeSignature, currentTimeSignatureBeatTime: BeatTime, measure: number) {
        const barsFromCurrentTimeSignature = measure - currentTimeSignature.measures;
        // TODO facto à faire ?
        const valueFactor = currentTimeSignature.timeSignature[1] / BeatTime.SIGNATURE[1] // TODO essayer de ne plus dépendre de BeatTime
        return new BeatTime(currentTimeSignatureBeatTime.value
            + barsFromCurrentTimeSignature * currentTimeSignature.timeSignature[0] / valueFactor);
    }

    getMidiTimeSignature(ticks: number): MidiTimeSignature {
        if (!this.midi) {
            throw new Error(`Impossible de trouver la signature rythmique courante sans données MIDI`);
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignatureAt
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.ticks > ticks);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }
}
