import {BeatTime, Position, PositionFormatter, SecTime} from "../time";
import {WarpMarker} from "../structure/warp-marker";
import {error, sum} from "../utils";

export type TimeSignature = [number, number];

/** Signature utilisée par le BeatTime Ableton Live quelle que soit la signature réelle */
const BEAT_TIME_SIGNATURE: TimeSignature = [4, 4];

export const DEFAULT_MIDI_TIME_SIGNATURE: MidiTimeSignature = {
    ticks: 0,
    timeSignature: [4, 4],
    measures: 0,
};

type WarpMarkerField = keyof WarpMarker;

export class Recording {

    constructor(
        /** Nom du fichier sans extension */
        readonly name: string,
        readonly sampleDurationInSeconds: number,
        readonly warpMarkers: WarpMarker[],
        readonly timeSignature?: TimeSignature,
        readonly midi?: Midi,
        readonly musicXmlString?: string) {
        if (!sampleDurationInSeconds) error(`L'enregistrement ${name} doit définir son sampleDurationInSeconds`);
        if (!(warpMarkers?.length >= 2)) error(`L'enregistrement ${name} doit contenir au moins deux WarpMarkers`)
    }

    /**
     * On ignore tout ce qu'il y a avant le premier warpMarker et après le dernier.
     * On calcule la moyenne pondérée par le temps (secTime) des tempos entre chaque warpMarker.
     * @return le tempo moyen en BPM
     */
    get meanTempo(): number {
        const weightedBps = this.regions
            .map(region => region.bps * region.secDuration)
            .reduce(sum, 0)
        const start = this.warpMarkers[0];
        const end = this.warpMarkers.at(-1)!;
        return weightedBps / (end.secTime - start.secTime) * 60
    }

    private _regions?: Region[]
    get regions() {
        if (!this._regions) {
            const regions: Region[] = []
            for (let endIndex = 1; endIndex < this.warpMarkers.length; ++endIndex) {
                const start = this.warpMarkers[endIndex - 1];
                const end = this.warpMarkers[endIndex];
                regions.push(new Region(start, end))
            }
            if (regions.length === 0) error(`Aucune région trouvée`);
            this._regions = regions;
        }
        return this._regions;
    }

    getRegionAtSecTime(secTime: SecTime): Region {
        return this.getRegionAtValue(secTime.value, "secTime");
    }

    getRegionAtBeatTime(beatTime: BeatTime): Region {
        return this.getRegionAtValue(beatTime.value, "beatTime");
    }

    private getRegionAtValue(value: number, field: WarpMarkerField): Region {
        return this.regions.find(region => value <= region.end[field]) ?? this.regions.at(-1)!;
    }

    /**
     * ATTENTION : pour que le calcul soit correct le Warp doit être fait comme si tout le sample était sur la même signature rythmique.
     * Sinon, il faut modifier chaque WarpMarker en adaptant la signature rythmique.
     * Cf. ConvertComponent
     */
    getSecTime(beatTime: BeatTime): SecTime | undefined {
        const region = this.getRegionAtBeatTime(beatTime);
        const secTimeValue = region.start.secTime + (beatTime.value - region.start.beatTime) / region.bps
        return new SecTime(secTimeValue);
    }

    getStartTime(note: MidiNote): SecTime | undefined {
        return this.getSecTimeFromTicks(note.ticks);
    }

    getEndTime(note: MidiNote): SecTime | undefined {
        return this.getSecTimeFromTicks(note.ticks + note.durationTicks);
    }

    getSecTimeFromTicks(ticks: number): SecTime | undefined {
        const midi = this.midi;
        if (!midi) return undefined
        const beatTime = BeatTime.fromMidiTicks(ticks, midi.header.ppq);
        return this.getSecTime(beatTime);
    }

    getSecTimeAt(position: Position): SecTime | undefined {
        const beatTime = this.getBeatTimeAt(position);
        if (beatTime === undefined) {
            return undefined
        }
        return this.getSecTime(beatTime);
    }

    private _midiTimeSignature: MidiTimeSignature | undefined;
    get midiTimeSignature(): MidiTimeSignature {
        if (!this.timeSignature) return DEFAULT_MIDI_TIME_SIGNATURE;
        this._midiTimeSignature ??= {
            ...DEFAULT_MIDI_TIME_SIGNATURE,
            timeSignature: this.timeSignature,
        };
        return this._midiTimeSignature
    }

    getPosition(beatTime: BeatTime): Position {
        const currentTimeSignature = this.getMidiTimeSignature(beatTime);

        let beatTimeFromCurrentTimeSignature = beatTime;
        if (this.midi) {
            const ticks = beatTime.toMidiTicks(this.midi.header.ppq);
            const ticksFromCurrentTimeSignature = ticks - currentTimeSignature.ticks;
            beatTimeFromCurrentTimeSignature = BeatTime.fromMidiTicks(ticksFromCurrentTimeSignature, this.midi.header.ppq);
        }

        return this.getPositionWithTimeSignature(beatTimeFromCurrentTimeSignature, currentTimeSignature);
    }

    private getPositionWithTimeSignature(beatTime: BeatTime, currentTimeSignature: MidiTimeSignature,) {
        const [tsNum, tsDen] = currentTimeSignature.timeSignature;
        const quartersPerBar = tsNum * BEAT_TIME_SIGNATURE[1] / tsDen;
        const quartersPerBeat = 1 / (tsDen / BEAT_TIME_SIGNATURE[1]); // = BEAT[1] / tsDen
        const quartersPerSixteenth = 1 / 4

        let remaining = beatTime.value;

        const bars = Math.floor(remaining / quartersPerBar);
        remaining -= bars * quartersPerBar;

        const beats = Math.floor(remaining / quartersPerBeat);
        remaining -= beats * quartersPerBeat;

        const sixteenths = Math.floor(remaining / quartersPerSixteenth);

        return new Position(
            currentTimeSignature.measures + bars,
            beats,
            sixteenths,
        );
    }

    private getMidiTimeSignature(beatTime: BeatTime): MidiTimeSignature {
        let currentTimeSignature = this.midiTimeSignature;

        if (this.midi) {
            const ticks = beatTime.toMidiTicks(this.midi.header.ppq);
            currentTimeSignature = this.findCurrentTimeSignature(ticks);
        }

        return currentTimeSignature;
    }

    private getMidiTimeSignatureAt(position: Position): MidiTimeSignature {
        if (!this.midi) {
            return this.midiTimeSignature
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignature
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.measures > position.bars);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }

    getTimeSignature(bar: number): TimeSignature {
        // TODO optimisation si une seule time signature ?
        const position = new Position(bar);
        const beatTime = this.getBeatTimeAt(position) ?? error(`Impossible de trouver le BeatTime à la position ${PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position)}`);
        return this.getMidiTimeSignature(beatTime).timeSignature;
    }

    private findCurrentTimeSignature(ticks: number): MidiTimeSignature {
        if (!this.midi) {
            throw new Error(`Impossible de trouver la signature rythmique courante sans données MIDI`);
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignatureAt
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.ticks > ticks);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }

    getBeatTime(secTime: SecTime): BeatTime | undefined {
        const region = this.getRegionAtSecTime(secTime);
        const beatTimeValue = region.start.beatTime + (secTime.value - region.start.secTime) * region.bps
        return new BeatTime(beatTimeValue);
    }

    getBeatTimeAt(position: Position): BeatTime | undefined {
        const currentTimeSignature = this.getMidiTimeSignatureAt(position);
        const currentTimeSignatureBeatTime = BeatTime.fromMidiTicks(currentTimeSignature.ticks, this.midi?.header?.ppq);
        return this.getBeatTimeWithTimeSignatureAt(currentTimeSignature, currentTimeSignatureBeatTime, position);
    }

    private getBeatTimeWithTimeSignatureAt(currentTimeSignature: MidiTimeSignature, currentTimeSignatureBeatTime: BeatTime, position: Position) {
        const barsFromCurrentTimeSignature = position.bars - currentTimeSignature.measures;
        // TODO facto à faire ?
        const valueFactor = currentTimeSignature.timeSignature[1] / BEAT_TIME_SIGNATURE[1]
        return new BeatTime(currentTimeSignatureBeatTime.value
            + barsFromCurrentTimeSignature * currentTimeSignature.timeSignature[0] / valueFactor
            + position.beats
            + position.sixteenths / 4);
    }
}

// TODO type pour le MIDI : https://github.com/Tonejs/Midi
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

class Region {
    constructor(
        readonly start: WarpMarker,
        readonly end: WarpMarker,
    ) {
    }

    get beatDuration(): number {
        return this.end.beatTime - this.start.beatTime
    }

    get secDuration(): number {
        return this.end.secTime - this.start.secTime
    }

    /**
     * @return Beats Per Second
     */
    get bps(): number {
        return this.beatDuration / this.secDuration
    }

}
