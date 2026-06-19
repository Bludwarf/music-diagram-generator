import {BaseColor as Color} from '../../color';
import {AsciiChords, Chords, Key} from '../../notes';
import {TimeSignature} from "../../time";

export class Pattern {

    constructor(
        readonly name: string,
        readonly durationInBars: number,
        readonly initial: string,
        readonly key?: Key,
        readonly chords?: Chords,
        readonly events?: any,
        readonly fretboard?: FretboardData,
        readonly color?: Color,
        readonly timeSignature?: TimeSignature,
    ) {
    }

    static fromData(data: PatternInitData): Pattern {
        const chords = data.chords ? Chords.fromAsciiChords(data.chords) : undefined
        const getDurationFrom = (chords: Chords | undefined) => {
            if (!chords) {
                throw new Error('Missing duration')
            }
            return chords.durationInBars
        }
        return new Pattern(
            data.name,
            data.durationInBars ? data.durationInBars : getDurationFrom(chords),
            data.initial ?? this.getInitialFromName(data.name),
            data.key,
            chords,
            data.events,
            data.fretboard,
            data.color,
        );
    }

    times(n: number) {
        return new Array(n).fill(this);
    }

    private static getInitialFromName(name: string) {
        return name[0];
    }

    // TODO constructeur de copie / clone pour éviter de tout dupliquer dans les entries
}

export interface PatternInitData {
    name: string
    durationInBars?: number
    initial?: string
    key?: Key
    chords?: AsciiChords
    events?: any
    fretboard?: FretboardData
    color?: Color
}

export interface FretboardData {
    lowestFret?: number
    fretsCount?: number
}
