import {Position, PositionedElement, PositionFormatter} from "../../time";
import {Structure} from "../structure";
import {Section} from "./section";
import {PatternInStructure} from "../pattern/pattern-in-structure";
import {PartInStructure} from "../part/part-in-structure";

export class SectionInStructure implements PositionedElement {

  partInStructure!: PartInStructure;

  constructor(
    readonly section: Section,
    readonly patternsInStructure: PatternInStructure[],
  ) {
    patternsInStructure.forEach(p => p.sectionInStructure = this)
  }

  get structure(): Structure {
    return this.partInStructure.structure;
  }

  get initial(): string {
    // TODO éviter les doublons
    return this.section.initial ?? this.section.name.charAt(0)
  }

  get startPosition(): Position {
    return this.patternsInStructure[0].startPosition
  }

  get endPosition(): Position {
    return this.patternsInStructure[this.patternsInStructure.length - 1].endPosition
  }

  getPatternInStructureAt(position: Position): PatternInStructure | undefined {
    return Position.getElementAt(position, this.patternsInStructure, false)
  }

  toString(): string {
    return `${PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(this.startPosition)}: ${this.section.name}`
  }
}
