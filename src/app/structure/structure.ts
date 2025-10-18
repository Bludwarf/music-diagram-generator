import {Position} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import {SectionInStructure} from "./section/section-in-structure";
import {Part} from "./part/part";
import {PartInStructure} from "./part/part-in-structure";
import {BaseColor as Color, ColorResolver} from "../color";
import {Section} from "./section/section";

class StructureBuilder {
  private _parts?: Part[];
  private defaultPart?: Part
  private defaultSection?: Section
  private _getEventsStartPosition?: (pattern: Pattern) => (Position) | undefined;
  private _getEventsDurationInBars?: (pattern: Pattern) => number | undefined

  parts(parts: typeof this._parts) {
    this._parts = parts
    return this
  }

  getEventsStartPosition(getEventsStartTime: typeof this._getEventsStartPosition) {
    this._getEventsStartPosition = getEventsStartTime
    return this
  }

  getEventsDurationInBars(getEventsDurationInBars: typeof this._getEventsDurationInBars) {
    this._getEventsDurationInBars = getEventsDurationInBars
    return this
  }

  add(pattern: Pattern): this {
    this.addPattern(pattern)
    return this
  }

  addPattern(pattern: Pattern): this {
    const part = this.getOrCreateDefaultPart()
    part.sections[0].patterns.push(pattern)
    return this
  }

  private getOrCreateDefaultPart(): Part {
    if (!this.defaultPart) {
      const section = this.getOrCreateDefaultSection()
      this.defaultPart = new Part('DefaultPart', [
        section,
      ])
      if (!this._parts) {
        this._parts = []
      }
      this._parts.push(this.defaultPart)
    }
    return this.defaultPart
  }

  private getOrCreateDefaultSection(): Section {
    if (!this.defaultSection) {
      this.defaultSection = new Section('DefaultSection', [])
    }
    return this.defaultSection
  }

  build(): Structure {
    let parts: Part[] | undefined
    if (this._parts) {
      parts = this._parts
    }
    if (!parts) {
      throw new Error('Missing parts')
    }

    return new Structure(
      parts,
      this._getEventsStartPosition,
      this._getEventsDurationInBars
    )
  }
}

export class Structure {

  key = 'Gm (mock)'; // TODO
  readonly partsInStructure: PartInStructure[];
  private readonly colorResolver = new ColorResolver(this)

  // TODO info pour savoir qui commence (ou quel instrument ou quelle piste)
  // TODO info pour marquer le type de fin (sur le 1, brutal, normal, fondu, ralenti)

  constructor(
    parts: Part[],
    getEventsStartPosition?: (pattern: Pattern) => Position | undefined, // TODO en attendant de savoir comment faire les events
    getEventsDurationInBars?: (pattern: Pattern) => number | undefined, // TODO en attendant de savoir comment faire les events
  ) {

    let currentPosition = new Position();

    const partsInStructure: PartInStructure[] = []
    for (const part of parts) {

      const sectionsInStructure: SectionInStructure[] = []
      for (const section of part.sections) {

        const patternsInStructure: PatternInStructure[] = []
        for (const pattern of section.patterns) {
          patternsInStructure.push(new PatternInStructure(pattern, currentPosition, getEventsStartPosition?.(pattern), getEventsDurationInBars?.(pattern)))
          currentPosition = currentPosition.addBars(pattern.durationInBars)
        }

        const sectionInStructure = new SectionInStructure(section, patternsInStructure)
        sectionsInStructure.push(sectionInStructure)
      }

      const partInStructure = new PartInStructure(part, this, sectionsInStructure)
      partsInStructure.push(partInStructure)
    }

    this.partsInStructure = partsInStructure

    // if (currentTime.toSeconds() !== sampleDuration.toSeconds()) {
    //   console.warn('currentTime != duration', currentTime.toSeconds(), currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toSeconds())
    // }
    // if (currentTime.toAbletonLiveBarsBeatsSixteenths() !== sampleDuration.toAbletonLiveBarsBeatsSixteenths()) {
    //   console.warn('currentTime != duration', currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toAbletonLiveBarsBeatsSixteenths())
    // }
  }

  getPartInStructureAt(position: Position): PartInStructure {
    return Position.getElementAtWithOverflow(position, this.partsInStructure)
  }

  static builder(): StructureBuilder {
    return new StructureBuilder()
  }

  get patternsInStructure(): PatternInStructure[] {
    return this.partsInStructure.flatMap(partInStructure =>
      partInStructure.patternsInStructure
    )
  }

  getPatternColor(patternInStructure: PatternInStructure): Color {
    return this.colorResolver.getPatternColor(patternInStructure)
  }

  get durationInBars(): number {
    let durationInBars = 0;
    for (const partInStructure of this.partsInStructure) {
      durationInBars += partInStructure.part.durationInBars
    }
    return durationInBars;
  }

}
