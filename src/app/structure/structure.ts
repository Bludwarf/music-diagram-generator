import { Time } from "../time";
import { Pattern } from "./pattern/pattern";
import * as Tone from 'tone'
import { PatternInStructure } from "./pattern/pattern-in-structure";

export class Structure {

    duration: Time
    private readonly startTimes: Time[]
    readonly patternsInStructure: PatternInStructure[]

    constructor(
        patterns: Pattern[],
        getEventsStartTime: (pattern: Pattern) => Time | undefined, // TODO en attendant de savoir comment faire les events
        getEventsDurationInBars: (pattern: Pattern) => number | undefined, // TODO en attendant de savoir comment faire les events
    ) {
        this.startTimes = []
        this.patternsInStructure = []

        let currentTime = new Time()
        for (const pattern of patterns) {
            this.patternsInStructure.push(new PatternInStructure(pattern, this, currentTime, getEventsStartTime(pattern), getEventsDurationInBars(pattern)))
            currentTime = currentTime.add(pattern.duration)
        }

        this.duration = currentTime
    }

    getPatternInStructureAt(time: Time): PatternInStructure | undefined {

        // TODO Attention : cette méthode n'est valable pour des time en seconds que si l'enregistrement est pile poil calé sur le tempo, sinon il faut convertir

        const firstPatternInStructure = this.patternsInStructure[0];
        if (time.isBefore(firstPatternInStructure.startTime)) {
            return undefined
        }

        for (const patternInStructure of this.patternsInStructure) {
            if (time.isBeforeOrEquals(patternInStructure.endTime)) {
                return patternInStructure
            }
        }

        return undefined
    }

}