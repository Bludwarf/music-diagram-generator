import {Time} from "../../time";
import {Structure} from "../structure";
import {Section} from "./section";
import {PatternInStructure} from "../pattern/pattern-in-structure";

export class SectionInStructure {

  constructor(
    readonly section: Section,
    readonly structure: Structure,
    readonly patternsInStructure: PatternInStructure[],
  ) {
  }

  get initial(): string {
    // TODO éviter les doublons
    return this.section.initial ?? this.section.name.charAt(0)
  }

  get startTime(): Time {
    return this.patternsInStructure[0].startTime
  }

  get endTime(): Time {
    return this.patternsInStructure[this.patternsInStructure.length - 1].endTime
  }

  getPatternInStructureAt(time: Time): PatternInStructure | undefined {
    return Time.getElementAt(time, this.patternsInStructure)
  }

  toString(): string {
    return `${this.startTime.toAbletonLiveBarsBeatsSixteenths()} @${this.startTime.toSeconds()}: ${this.section.name} :@${this.endTime.toSeconds()}`
  }
}
