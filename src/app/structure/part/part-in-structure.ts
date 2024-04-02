import {Time} from "../../time";
import {Structure} from "../structure";
import {Part} from "./part";
import {SectionInStructure} from "../section/section-in-structure";
import {InStructure} from "../in-structure";
import {PatternInStructure} from "../pattern/pattern-in-structure";

export class PartInStructure implements InStructure {
  constructor(
    readonly part: Part,
    readonly structure: Structure,
    readonly sectionsInStructure: SectionInStructure[],
  ) {
  }

  get initial(): string {
    // TODO éviter les doublons
    return /*this.part.initial ??*/ this.part.name.charAt(0)
  }

  get startTime(): Time {
    return this.sectionsInStructure[0].startTime
  }

  get endTime(): Time {
    return this.sectionsInStructure[this.sectionsInStructure.length - 1].endTime
  }

  getSectionInStructureAt(time: Time): SectionInStructure | undefined {
    return Time.getElementAt(time, this.sectionsInStructure)
  }

  get patternsInStructure(): PatternInStructure[] {
    return this.sectionsInStructure.flatMap(sectionInStructure =>
      sectionInStructure.patternsInStructure
    )
  }

  toString(): string {
    return `${this.startTime.toAbletonLiveBarsBeatsSixteenths()} @${this.startTime.toSeconds()}: ${this.part.name} :@${this.endTime.toSeconds()}`
  }
}
