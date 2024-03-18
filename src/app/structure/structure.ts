import {Time} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import {StructureObject} from "../als/structure-extractor-from-als";
import {WarpMarker} from "./warp-marker";
import * as Tone from "tone";
import {error} from "../utils";
import {Section} from "./section/section";
import {SectionInStructure} from "./section/section-in-structure";

function getSampleBeatTimeDurationFromPatterns(patterns: Pattern[]) {
  return Time.sum(patterns.map(p => p.duration)).toBeatTime()
}

class StructureBuilder {
  private _stuctureObject?: StructureObject;
  private _sections?: Section[];
  private _patterns?: Pattern[];
  private _getEventsStartTime?: (pattern: Pattern) => (Time) | undefined;
  private _getEventsDurationInBars?: (pattern: Pattern) => number | undefined

  stuctureObject(stuctureObject: typeof this._stuctureObject) {
    this._stuctureObject = stuctureObject;
    return this
  }

  sections(sections: typeof this._sections) {
    this._sections = sections
    return this
  }

  /** @deprecated Utiliser plutôt sections */
  patterns(sections: typeof this._patterns) {
    this._patterns = sections
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

    // TODO attention au typage de getSampleBeatTimeDurationFromPatterns()
    const sampleBeatTimeDuration = this._stuctureObject.sampleBeatTimeDuration ?? getSampleBeatTimeDurationFromPatterns(sections)
    return new Structure(
      Time.fromValue(this._stuctureObject.sampleDuration),
      sampleBeatTimeDuration,
      sections,
      this._stuctureObject.warpMarkers,
      this._getEventsStartTime,
      this._getEventsDurationInBars
    )
  }
}

export class Structure {

  readonly sectionsInStructure: SectionInStructure[]
  key = 'Gm (mock)'; // TODO

  constructor(
    readonly sampleDuration: Time,
    readonly sampleBeatTimeDuration: number,
    sections: Section[],
    readonly warpMarkers: WarpMarker[],
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

    if (currentTime.toSeconds() !== sampleDuration.toSeconds()) {
      console.warn('currentTime != duration', currentTime.toSeconds(), currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toSeconds())
    }
    if (currentTime.toAbletonLiveBarsBeatsSixteenths() !== sampleDuration.toAbletonLiveBarsBeatsSixteenths()) {
      console.warn('currentTime != duration', currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toAbletonLiveBarsBeatsSixteenths())
    }

    console.log('Structure created :')
    this.sectionsInStructure.forEach(s => console.log(s.toString()))
  }

  getSectionInStructureAt(time: Time): SectionInStructure | undefined {
    return Time.getElementAt(time, this.sectionsInStructure, true)
  }

  static builder(): StructureBuilder {
    return new StructureBuilder()
  }

  private getWarpMarkers(): WarpMarker[] {
    return [
      ...this.warpMarkers,
      // TODO pour trouver le WrappedTime après le dernier WrapMarker, il faut calculer le tempo à la fin et interpoler
      // TODO Pour l'instant on le déduit à la louche
      // TODO que se passe-t-il si le sample continue alors que la structure est finie ?
      new WarpMarker(this.sampleDuration.toSeconds(), this.sampleBeatTimeDuration),
    ]
  }

  // validateWrapMarker() {
  //   const warpMarkers = this.getWarpMarkers()
  //   const lastWrapMarker = warpMarkers[warpMarkers.length - 1];
  //   const sampleDurationInSeconds = this.duration.toSeconds();
  //   if (lastWrapMarker.secTime !== sampleDurationInSeconds) {
  //     const sampleCode = `new WrapMarker(${sampleDurationInSeconds}, "beatTime relevé dans Ableton Live à la fin du sample"),`
  //     error(`Pour le moment, on doit ajouter la main un dernier WrapMarker précisément à la fin du sample : ${sampleCode}`)
  //   }
  // }

  getWarpPosition(seconds: number): Time | undefined {

    const warpMarkers = this.getWarpMarkers()

    if (seconds < warpMarkers[0].secTime) {
      return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
    }

    if (seconds > warpMarkers[warpMarkers.length - 1].secTime) {
      return undefined // TODO quelle position si on est après le dernier WrapMarker ?
    }

    const exactWarpMarker = warpMarkers.find(wrapMarker => seconds === wrapMarker.secTime)
    if (exactWarpMarker) {
      return Time.fromBeatTime(exactWarpMarker.beatTime)
    }

    const nextWrapMarkerIndex = warpMarkers.findIndex(wrapMarker => seconds < wrapMarker.secTime)

    const previousWrapMarker = warpMarkers[nextWrapMarkerIndex - 1]
    const nextWrapMarker = warpMarkers[nextWrapMarkerIndex]
    const secTimeRatio = (seconds - previousWrapMarker.secTime) / (nextWrapMarker.secTime - previousWrapMarker.secTime)
    const beatTime = previousWrapMarker.beatTime + secTimeRatio * (nextWrapMarker.beatTime - previousWrapMarker.beatTime)

    return Time.fromBeatTime(beatTime)
  }

  getWrappedTime(position: Time): Time | undefined {

    const warpMarkers = this.getWarpMarkers()

    const beatTime = position.toAbletonLiveBeatTime()

    if (beatTime < warpMarkers[0].beatTime) {
      return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
    }

    if (beatTime > warpMarkers[warpMarkers.length - 1].beatTime) {
      // TODO quelle position si on est après le dernier WrapMarker ?
      error(`beatTime après le dernier WrapMarker : ${beatTime} > ${warpMarkers[warpMarkers.length - 1].beatTime}`)
    }

    const nextWrapMarkerIndex = warpMarkers.findIndex(wrapMarker => beatTime < wrapMarker.beatTime)

    const previousWrapMarker = warpMarkers[nextWrapMarkerIndex - 1]
    const nextWrapMarker = warpMarkers[nextWrapMarkerIndex]
    const beatTimeRatio = (beatTime - previousWrapMarker.beatTime) / (nextWrapMarker.beatTime - previousWrapMarker.beatTime)
    const secTime = previousWrapMarker.secTime + beatTimeRatio * (nextWrapMarker.secTime - previousWrapMarker.secTime)

    return new Time(Tone.Time(secTime))
  }
}
