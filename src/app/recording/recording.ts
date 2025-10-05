import {BeatTime, Position, SecTime} from "../time";
import {WarpMarker} from "../structure/warp-marker";
import {Builder, error, sum} from "../utils";

const DEFAULT_TIME_SIGNATURE = {
    ticks: 0,
    timeSignature: [4, 4],
    measures: 0,
};

export class Recording {
    constructor(
        /** Nom du fichier sans extension */
        readonly name: string,
        readonly sampleDurationInSeconds: number,
        readonly sampleBeatTimeDuration: number,
        readonly warpMarkers: WarpMarker[],
        private readonly originalWarpMarkersLength = warpMarkers.length, // à cause de normalizeWarpMarker
        readonly midi?: Midi,
    ) {
        this.normalizeWarpMarker()
    }

    static builder(): RecordingBuilder {
        return new RecordingBuilder()
    }

    get sampleEndBeatTime(): number {
        return this.sampleBeatTimeDuration + this.warpMarkers[0].beatTime
    }

    private normalizeWarpMarker(): void {
        const lastWarpMarker = this.warpMarkers[this.warpMarkers.length - 1]
        const missingSampleEndWarpMarker = lastWarpMarker.beatTime < this.sampleEndBeatTime
        if (missingSampleEndWarpMarker) {
            // Pour simplifier le code de getWarpPosition(), on ajoute systématiquement un WarpMarker à la fin du sample
            if (this.sampleBeatTimeDuration < lastWarpMarker.beatTime) {
                // TODO pour le moment on laisse passer, car certains morceaux n'ont pas de sampleBeatTimeDuration valides ("Noyer le silence"), ce qui est peut-être normal
                console.warn(`La durée du sample en BeatTime (${this.sampleBeatTimeDuration}) doit être supérieure au BeatTime du dernier WarpMarker (${lastWarpMarker.beatTime})`)
            } else {
                this.warpMarkers.push(new WarpMarker(this.sampleDurationInSeconds, this.sampleEndBeatTime))
            }
        }
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
        const end = this.warpMarkers[this.originalWarpMarkersLength - 1];
        return weightedBps / (end.secTime - start.secTime) * 60
    }

    get regions() {
        const regions: Region[] = []
        for (let endIndex = 1; endIndex < this.originalWarpMarkersLength; ++endIndex) {
            const start = this.warpMarkers[endIndex - 1];
            const end = this.warpMarkers[endIndex];
            regions.push(new Region(start, end))
        }
        return regions;
    }

    /**
     * ATTENTION : pour que le calcul soit correct le Warp doit être fait comme si tout le sample était sur la même signature rythmique.
     * Sinon, il faut modifier chaque WarpMarker en adaptant la signature rythmique.
     * Cf. ConvertComponent
     */
    getSecTime(beatTime: BeatTime): SecTime | undefined {
        const beatTimeValue = beatTime.value;
        const warpMarkers = this.warpMarkers

        if (beatTimeValue < warpMarkers[0].beatTime) {
            return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
        }

        if (beatTimeValue > warpMarkers[warpMarkers.length - 1].beatTime) {
            // TODO quelle position si on est après le dernier WrapMarker ?
            error(`beatTime après le dernier WrapMarker : ${beatTimeValue} > ${warpMarkers[warpMarkers.length - 1].beatTime}`)
        }

        const nextWrapMarkerIndex = warpMarkers.findIndex(wrapMarker => beatTimeValue < wrapMarker.beatTime)

        const previousWrapMarker = warpMarkers[nextWrapMarkerIndex - 1]
        const nextWrapMarker = warpMarkers[nextWrapMarkerIndex]
        const beatTimeRatio = (beatTimeValue - previousWrapMarker.beatTime) / (nextWrapMarker.beatTime - previousWrapMarker.beatTime)
        const secTime = previousWrapMarker.secTime + beatTimeRatio * (nextWrapMarker.secTime - previousWrapMarker.secTime)

        return new SecTime(secTime);
    }

  getSecTimeAt(position: Position): SecTime | undefined {
    const beatTime = this.getBeatTimeAt(position);
    if (beatTime === undefined) {
      return undefined
    }
    return this.getSecTime(beatTime);
  }

    getPosition(beatTime: BeatTime): Position {
        if (this.midi) {
            const ticks = beatTime.toMidiTicks(this.midi.header.ppq);
            const currentTimeSignature = this.findCurrentTimeSignature(ticks);
            const ticksFromCurrentTimeSignature = ticks - currentTimeSignature.ticks;
            const beatTimeFromCurrentTimeSignature = BeatTime.fromMidiTicks(ticksFromCurrentTimeSignature, this.midi.header.ppq);
            return this.getPositionWithTimeSignature(beatTimeFromCurrentTimeSignature, currentTimeSignature);
        }

        // On considère qu'on est en 4/4 si on n'a aucune données MIDI
        return this.getPositionWithTimeSignature(beatTime, DEFAULT_TIME_SIGNATURE);
    }

    private getPositionWithTimeSignature(beatTimeFromCurrentTimeSignature: BeatTime, currentTimeSignature: MidiTimeSignature) {
        if (currentTimeSignature.timeSignature[1] !== 4) {
            throw new Error(`Seules les signatures */4 sont implémentées`);
        }
        // console.log(`beatTimeFromCurrentTimeSignature`, beatTimeFromCurrentTimeSignature.value, this.getPositionWithTimeSignature(beatTimeFromCurrentTimeSignature, currentTimeSignature).toAbletonLiveString());
        const barsFromCurrentTimeSignature = Math.floor(beatTimeFromCurrentTimeSignature.value / currentTimeSignature.timeSignature[0]); // TODO ts.dénum
        const bars = currentTimeSignature.measures + barsFromCurrentTimeSignature;
        return new Position(
            bars,
            Math.floor(beatTimeFromCurrentTimeSignature.value) - barsFromCurrentTimeSignature * currentTimeSignature.timeSignature[0], // TODO ts.dénum
            beatTimeFromCurrentTimeSignature.value % 1 * 4, // TODO ts.dénum
        );
    }

    private findCurrentTimeSignature(ticks: number): MidiTimeSignature {
        if (!this.midi) {
            throw new Error(`Impossible de trouver la signature rythmique courante sans données MIDI`);
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec findCurrentTimeSignatureAt
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.ticks > ticks);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }

    getBeatTime(secTime: SecTime): BeatTime | undefined {
        // TODO facto avec getBeatTime => réutiliser regions => ne pas oublier de gérer l'overflow, quand on dépasse le dernier WarpMarker original (mais avant celui ajouté par cette classe)
        const secTimeValue = secTime.value;
        const warpMarkers = this.warpMarkers

        if (secTimeValue < warpMarkers[0].secTime) {
            return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
        }

        if (secTimeValue > warpMarkers[warpMarkers.length - 1].secTime) {
            // TODO quelle position si on est après le dernier WrapMarker ?
            error(`beatTime après le dernier WrapMarker : ${secTimeValue} > ${warpMarkers[warpMarkers.length - 1].secTime}`)
        }

        const nextWrapMarkerIndex = warpMarkers.findIndex(wrapMarker => secTimeValue < wrapMarker.secTime)

        const previousWrapMarker = nextWrapMarkerIndex !== -1 ? warpMarkers[nextWrapMarkerIndex - 1] : warpMarkers[warpMarkers.length - 2]
        const nextWrapMarker = nextWrapMarkerIndex !== -1 ? warpMarkers[nextWrapMarkerIndex] : warpMarkers[warpMarkers.length - 1]
        const secTimeRatio = (secTimeValue - previousWrapMarker.secTime) / (nextWrapMarker.secTime - previousWrapMarker.secTime)
        const beatTimeValue = previousWrapMarker.beatTime + secTimeRatio * (nextWrapMarker.beatTime - previousWrapMarker.beatTime)

        return new BeatTime(beatTimeValue);
    }

    getBeatTimeAt(position: Position): BeatTime | undefined {
        if (this.midi) {
            const currentTimeSignature = this.findCurrentTimeSignatureAt(position);
            const currentTimeSignatureBeatTime = BeatTime.fromMidiTicks(currentTimeSignature.ticks, this.midi.header.ppq);
            return this.getBeatTimeWithTimeSignatureAt(currentTimeSignature, currentTimeSignatureBeatTime, position);
        }

        // On considère qu'on est en 4/4 si on n'a aucune données MIDI
        return this.getBeatTimeWithTimeSignatureAt(DEFAULT_TIME_SIGNATURE, new BeatTime(0), position);
    }

    private getBeatTimeWithTimeSignatureAt(currentTimeSignature: MidiTimeSignature, currentTimeSignatureBeatTime: BeatTime, position: Position) {
        const barsFromCurrentTimeSignature = position.bars - currentTimeSignature.measures;
        if (currentTimeSignature.timeSignature[1] !== 4) {
            throw new Error(`Seules les signatures */4 sont implémentées`);
        }
        return new BeatTime(currentTimeSignatureBeatTime.value
            + barsFromCurrentTimeSignature * currentTimeSignature.timeSignature[0]
            + position.beats
            + position.sixteenths / 4);
    }

    private findCurrentTimeSignatureAt(position: Position): MidiTimeSignature {
        if (!this.midi) {
            throw new Error(`Impossible de trouver la signature rythmique courante sans données MIDI`);
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec findCurrentTimeSignature
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.measures > position.bars);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
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
    timeSignature: number[]; // TODO tableau à deux number
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

class RecordingBuilder implements Builder<Recording> {
    private _initData?: RecordingInitData;
    private _midi?: Midi;

    initData(dto: typeof this._initData): this {
        this._initData = dto
        return this
    }

    // TODO type pour le MIDI
    midi(midi: Midi): this {
        this._midi = midi
        return this
    }

    build(): Recording {
        if (!this._initData) {
            throw new Error('Missing DTO')
        }
        return new Recording(
            this._initData.name,
            this._initData.sampleDuration,
            this._initData.sampleBeatTimeDuration,
            this._initData.warpMarkers,
            undefined,
            this._midi,
        )
    }
}

export interface RecordingInitData {
    /**
     * Nom du sample
     */
    name: string;

    /**
     * Durée du sample original en secondes.
     */
    sampleDuration: number

    /**
     * Durée totale du sample en battements (BeatTime).
     */
    sampleBeatTimeDuration: number

    warpMarkers: WarpMarker[]
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
