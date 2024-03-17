import {Time} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import * as Tone from "tone";
import {StructureObject} from "../als/structure-extractor-from-als";

class StructureBuilder {
  private _stuctureObject?: StructureObject;
  private _patterns?: Pattern[];
  private _getEventsStartTime?: (pattern: Pattern) => (Time) | undefined;
  private _getEventsDurationInBars?: (pattern: Pattern) => number | undefined

  stuctureObject(stuctureObject: typeof this._stuctureObject) {
    this._stuctureObject = stuctureObject;
    return this
  }

  patterns(patterns: typeof this._patterns) {
    this._patterns = patterns
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
    if (!this._stuctureObject) {
      throw new Error('Missing stuctureObject')
    }
    if (!this._patterns) {
      throw new Error('Missing patterns')
    }
    if (!this._getEventsStartTime) {
      throw new Error('Missing getEventsStartTime')
    }
    if (!this._getEventsDurationInBars) {
      throw new Error('Missing getEventsDurationInBars')
    }
    return new Structure(
      new Time(Tone.Time(this._stuctureObject.sampleDuration, 's')),
      this._patterns,
      this._getEventsStartTime,
      this._getEventsDurationInBars
    )
  }
}

export class Structure {

  private readonly startTimes: Time[]
  readonly patternsInStructure: PatternInStructure[]

  constructor(
    readonly duration: Time,
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

  static builder(): StructureBuilder {
    return new StructureBuilder()
  }
}
