import {checkIsInteger, checkIsPositive, checkIsStrictlyPositive} from "./utils/validators";
import {error} from "./utils";
import {BarNumber0Indexed} from "./notes";

interface BarsBeatsSixteenthsFields {
    /** 0-indexée */
    bars: BarNumber0Indexed
    beats: number
    sixteenths: number
}

/** Temps en comptant à la noire (1 battement (pulse) = 1 temps en 4/4 ou 0.5 temps en 6/8)  */
export class BeatTime {

    /** Signature utilisée par le BeatTime Ableton Live quelle que soit la signature réelle */
    static readonly SIGNATURE: TimeSignature = [4, 4];

    static readonly QUARTERS_PER_BEAT = 1 / this.SIGNATURE[1]

    constructor(
        readonly value: number,
    ) {
    }

    static fromMidiTicks(ticks: number, ppq?: number): BeatTime {
        let beatTimeValue;
        if (ticks === 0) {
            beatTimeValue = 0;
        } else {
            if (!ppq) error(`PPQ requis si ticks > 0`)
            beatTimeValue = ticks / ppq;
        }
        // TODO cache pour chaque ticks, pour perfs
        return new BeatTime(beatTimeValue);
    }

    toMidiTicks(ppq: number): number {
        // TODO cache pour chaque ticks, pour perfs
        return this.value * ppq;
    }

    static forEachQuarter(beatTimeStartValue: number, durationInBeats: number, callback: (beatTime: BeatTime) => void) {
        for (let beatTimeValue = beatTimeStartValue; beatTimeValue < beatTimeStartValue + durationInBeats; beatTimeValue += BeatTime.QUARTERS_PER_BEAT) {
            const beatTime = new BeatTime(beatTimeValue);
            callback(beatTime);
        }
    }
}

export class Position implements BarsBeatsSixteenthsFields {
    /**
     * @param bars integer 0-indexed
     * @param beats positive integer 0-indexed
     * @param sixteenths positive float 0-indexed
     */
    constructor(
        readonly bars = 0,
        readonly beats = 0,
        readonly sixteenths = 0,
    ) {
        checkIsInteger('bars', this.bars);
        checkIsPositive('beats', this.beats);
        checkIsInteger('beats', this.beats);
        checkIsPositive('sixteenths', this.sixteenths);
    }

    addBars(bars: number): Position {
        return new Position(
            this.bars + bars,
            this.beats,
            this.sixteenths,
        )
    }

    addBeats(beats: number, beatsPerBar: number) {
        const rawBeats = this.beats + beats;
        return new Position(
            this.bars + Math.floor(rawBeats / beatsPerBar),
            rawBeats % beatsPerBar,
        )
    }

    private static checkOnlyBars(fields: BarsBeatsSixteenthsFields) {
        if (fields.beats !== 0 || fields.sixteenths !== 0) {
            throw new Error('Not implemented for position with more than bars only');
        }
    }

    isBefore(other: Position): boolean {
        return this.compareTo(other) < 0
    }

    isBeforeOrEquals(other: Position): boolean {
        return this.compareTo(other) <= 0
    }

    compareTo(other: Position): number {
        if (this.bars !== other.bars) {
            return this.bars - other.bars;
        }
        if (this.beats !== other.beats) {
            return this.beats - other.beats;
        }
        if (this.sixteenths !== other.sixteenths) {
            return this.sixteenths - other.sixteenths;
        }
        return 0;
    }

    /**
     * @param position
     * @param elements
     * @param overflow Doit-on renvoyer le 1er élément ou le dernier élément si la position dépasse les éléments (sinon undefined) ?
     */
    static getElementAt<E extends PositionedElement>(position: Position, elements: E[], overflow: boolean): E | undefined {
        const firstElement = elements[0];
        if (position.isBefore(firstElement.startPosition)) {
            return overflow ? firstElement : undefined
        }

        for (const element of elements) {
            if (position.isBefore(element.endPosition)) {
                return element
            }
        }

        return overflow ? elements[elements.length - 1] : undefined
    }

    /**
     * @see getElementAt
     */
    static getElementAtWithOverflow<E extends PositionedElement>(position: Position, elements: E[]): E {
        return this.getElementAt(position, elements, true) as E
    }

    relativeTo(startPosition: Position): Position {
        Position.checkOnlyBars(startPosition);
        return new Position(this.bars - startPosition.bars, this.beats, this.sixteenths)
    }

    modBars(bars: number): Position {
        checkIsStrictlyPositive('bars', bars);
        checkIsInteger('bars', bars);
        return new Position(this.bars % bars, this.beats, this.sixteenths)
    }
}

export class PositionFormatter {
    static DEBUG = new PositionFormatter(':', 0, false);
    static ABLETON_GLOBAL_TIMECODE = new PositionFormatter('.', 1, true);

    /**
     * @param separator
     * @param offset Décalage des valeurs par rapport à 0
     * @param roundedSixteenths Arrondir sixteenths vers le bas (floor) ?
     */
    constructor(
        protected readonly separator: string,
        protected readonly offset: number,
        protected readonly roundedSixteenths: boolean,
    ) {
    }

    format(position: Position): string {
        const sixteenths = this.roundedSixteenths ? Math.floor(position.sixteenths) : position.sixteenths;
        return `${position.bars + this.offset}${this.separator}${position.beats + this.offset}${this.separator}${sixteenths + this.offset}`
    }

    parse(string: string): Position {
        const fields = string.split(this.separator);
        return new Position(
            this.parseField(fields[0]),
            this.parseField(fields[1]),
            this.parseField(fields[2]),
        );
    }

    private parseField(fieldStringValue: string | undefined) {
        if (fieldStringValue === undefined || fieldStringValue === '') {
            return 0;
        }
        return +fieldStringValue - this.offset;
    }
}

export interface PositionedElement {
    /** inclusif */
    startPosition: Position;
    /** exclusif */
    endPosition: Position;
}

export class SecTime {
    constructor(
        readonly value: number,
    ) {
    }
}

export type TimeSignature = readonly [number, number];
