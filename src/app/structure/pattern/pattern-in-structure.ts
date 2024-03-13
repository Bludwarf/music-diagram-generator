import { Time } from "../../time";
import { Structure } from "../structure";
import { Pattern } from "./pattern";

export class PatternInStructure {

    readonly endTime: Time

    constructor(
        readonly pattern: Pattern,
        readonly structure: Structure,
        readonly startTime: Time,
    ) {
        this.endTime = startTime.add(pattern.duration)
    }

}
