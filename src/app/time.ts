import {Seconds} from "tone/build/esm/core/type/Units";
import {checkIsInteger, checkIsPositive, checkIsStrictlyPositive} from "./utils/validators";

interface BarsBeatsSixteenthsFields {
    /** 0-indexée */
    bars: number
    beats: number
    sixteenths: number
}

/** Temps en comptant par battement (pulse)  */
export class BeatTime {
    constructor(
        readonly value: number,
    ) {
    }

    static fromMidiTicks(ticks: number, ppq: number): BeatTime {
        // TODO cache pour chaque ticks, pour perfs
        return new BeatTime(ticks / ppq);
    }

    toMidiTicks(ppq: number): number {
        // TODO cache pour chaque ticks, pour perfs
        return this.value * ppq;
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

    static fromToneTransportSeconds(seconds: Seconds): SecTime {
        return new SecTime(seconds)
    }
}
