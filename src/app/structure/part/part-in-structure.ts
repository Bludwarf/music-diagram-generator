import {Position, PositionedElement, PositionFormatter} from "../../time";
import {Structure} from "../structure";
import {Part} from "./part";
import {SectionInStructure} from "../section/section-in-structure";
import {InStructure} from "../in-structure";
import {PatternInStructure} from "../pattern/pattern-in-structure";

export class PartInStructure implements InStructure, PositionedElement {
  constructor(
    readonly part: Part,
    readonly structure: Structure,
    readonly sectionsInStructure: SectionInStructure[],
  ) {
    sectionsInStructure.forEach(s => s.partInStructure = this)
  }

  get initial(): string {
    // TODO éviter les doublons
    return /*this.part.initial ??*/ this.part.name.charAt(0)
  }

  get startPosition(): Position {
    return this.sectionsInStructure[0].startPosition
  }

  get endPosition(): Position {
    return this.sectionsInStructure[this.sectionsInStructure.length - 1].endPosition
  }

  getSectionInStructureAt(position: Position): SectionInStructure | undefined {
    return Position.getElementAt(position, this.sectionsInStructure, false)
  }

  get patternsInStructure(): PatternInStructure[] {
    return this.sectionsInStructure.flatMap(sectionInStructure =>
      sectionInStructure.patternsInStructure
    )
  }

  toString(): string {
    return `${PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(this.startPosition)}: ${this.part.name}`
  }
}
