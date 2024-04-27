import { Chord, Key } from "../../notes";
import { Time, TimedElement } from "../../time";
import { Structure } from "../structure";
import { Pattern } from "./pattern";

export class PatternInStructure implements TimedElement {

    readonly endTime: Time

    constructor(
        readonly pattern: Pattern,
        readonly structure: Structure,
        readonly startTime: Time,
        readonly eventsStartTime?: Time,
        readonly eventsDurationInBars = pattern.duration.toBars(),
    ) {
        this.endTime = startTime.add(pattern.duration)
    }

    get initial(): string {
        // TODO éviter les doublons
        return this.pattern.initial ?? this.pattern.name.charAt(0)
    }

    getChordAt(time: Time): Chord | undefined {
        const relativeTime = time.relativeTo(this.startTime)
        // console.log('getChordAt', time.toBarsBeatsSixteenths(), relativeTime.toString(), '\n' + this.pattern.chords?.toString())
        return this.pattern.chords?.getChordAt(relativeTime)
    }

    getKeyAt(time: Time): Key | undefined {
        return this.pattern.key
    }

}
