import {Time} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import {Section} from "./section/section";
import {SectionInStructure} from "./section/section-in-structure";

class StructureBuilder {
  private _sections?: Section[];
  private _patterns?: Pattern[];
  private _getEventsStartTime?: (pattern: Pattern) => (Time) | undefined;
  private _getEventsDurationInBars?: (pattern: Pattern) => number | undefined

  sections(sections: typeof this._sections) {
    this._sections = sections
    return this
  }

  getEventsStartTime(getEventsStartTime: typeof this._getEventsStartTime) {
    this._getEventsStartTime = getEventsStartTime
    return this
  }

  getEventsDurationInBars(getEventsDurationInBars: typeof this._getEventsDurationInBars) {
    this._getEventsDurationInBars = getEventsDurationInBars
    return this
  }

  build(): Structure {
    let sections: Section[] | undefined
    if (this._sections) {
      sections = this._sections
    }
    if (this._patterns) {
      const defaultSection = new Section('Section', this._patterns);
      sections = [defaultSection]
    }
    if (!sections) {
      throw new Error('Missing sections or patterns')
    }

    return new Structure(
      sections,
      this._getEventsStartTime,
      this._getEventsDurationInBars
    )
  }
}

export class Structure {

  readonly sectionsInStructure: SectionInStructure[]
  key = 'Gm (mock)'; // TODO

  constructor(
    sections: Section[],
    getEventsStartTime?: (pattern: Pattern) => Time | undefined, // TODO en attendant de savoir comment faire les events
    getEventsDurationInBars?: (pattern: Pattern) => number | undefined, // TODO en attendant de savoir comment faire les events
  ) {
    this.sectionsInStructure = []

    let currentTime = new Time()
    for (const section of sections) {

      const patternsInStructure: PatternInStructure[] = []
      for (const pattern of section.patterns) {
        patternsInStructure.push(new PatternInStructure(pattern, this, currentTime, getEventsStartTime?.(pattern), getEventsDurationInBars?.(pattern)))
        currentTime = currentTime.add(pattern.duration)
      }

      const sectionInStructure = new SectionInStructure(section, this, patternsInStructure);
      this.sectionsInStructure.push(sectionInStructure)
    }

    // if (currentTime.toSeconds() !== sampleDuration.toSeconds()) {
    //   console.warn('currentTime != duration', currentTime.toSeconds(), currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toSeconds())
    // }
    // if (currentTime.toAbletonLiveBarsBeatsSixteenths() !== sampleDuration.toAbletonLiveBarsBeatsSixteenths()) {
    //   console.warn('currentTime != duration', currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toAbletonLiveBarsBeatsSixteenths())
    // }

    console.log('Structure created :')
    this.sectionsInStructure.forEach(s => console.log(s.toString()))
  }

  getSectionInStructureAt(time: Time): SectionInStructure | undefined {
    return Time.getElementAt(time, this.sectionsInStructure, true)
  }

  static builder(): StructureBuilder {
    return new StructureBuilder()
  }

}
