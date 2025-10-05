import {Chord, Key} from "../../notes";
import {Position, PositionedElement} from "../../time";
import {Structure} from "../structure";
import {Pattern} from "./pattern";

export class PatternInStructure implements PositionedElement {

    readonly endPosition: Position

    constructor(
        readonly pattern: Pattern,
        readonly structure: Structure,
        readonly startPosition: Position,
        readonly eventsStartPosition?: Position,
        readonly eventsDurationInBars = pattern.durationInBars,
    ) {
        this.endPosition = startPosition.addBars(pattern.durationInBars)
    }

    get initial(): string {
        // TODO éviter les doublons
        return this.pattern.initial ?? this.pattern.name.charAt(0)
    }

    getChordAt(position: Position): Chord | undefined {
        const relativePosition = position.relativeTo(this.startPosition)
        return this.pattern.chords?.getChordAt2(relativePosition)
    }

    getKeyAt(position: Position): Key | undefined {
        return this.pattern.key
    }

}
