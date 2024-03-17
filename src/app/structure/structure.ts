import {Time} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import {StructureObject} from "../als/structure-extractor-from-als";
import {WarpMarker} from "./warp-marker";
import * as Tone from "tone";

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
    return new Structure(
      Time.fromValue(this._stuctureObject.sampleDuration),
      this._patterns,
      this._stuctureObject.warpMarkers,
      this._getEventsStartTime,
      this._getEventsDurationInBars
    )
  }
}

export class Structure {

  readonly patternsInStructure: PatternInStructure[]

  constructor(
    readonly sampleDuration: Time,
    patterns: Pattern[],
    readonly warpMarkers: WarpMarker[],
    getEventsStartTime?: (pattern: Pattern) => Time | undefined, // TODO en attendant de savoir comment faire les events
    getEventsDurationInBars?: (pattern: Pattern) => number | undefined, // TODO en attendant de savoir comment faire les events
  ) {
    this.patternsInStructure = []

    let currentTime = new Time()
    for (const pattern of patterns) {
      this.patternsInStructure.push(new PatternInStructure(pattern, this, currentTime, getEventsStartTime?.(pattern), getEventsDurationInBars?.(pattern)))
      currentTime = currentTime.add(pattern.duration)
    }

    if (currentTime.toSeconds() !== sampleDuration.toSeconds()) {
      console.warn('currentTime != duration', currentTime.toSeconds(), currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toSeconds())
    }
    if (currentTime.toAbletonLiveBarsBeatsSixteenths() !== sampleDuration.toAbletonLiveBarsBeatsSixteenths()) {
      console.warn('currentTime != duration', currentTime.toAbletonLiveBarsBeatsSixteenths(), sampleDuration.toAbletonLiveBarsBeatsSixteenths())
    }
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

  private getWarpMarkers(): WarpMarker[] {
    return [
      ...this.warpMarkers,
      // TODO pour trouver le WrappedTime après le dernier WrapMarker, il faut calculer le tempo à la fin et interpoler
      // TODO Pour l'instant on le déduit à la louche
      // TODO que se passe-t-il si le sample continue alors que la structure est finie ?
      new WarpMarker(this.sampleDuration.toSeconds(), 380),
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
      return undefined // TODO quelle position si on est après le dernier WrapMarker ?
    }

    const nextWrapMarkerIndex = warpMarkers.findIndex(wrapMarker => beatTime < wrapMarker.beatTime)

    const previousWrapMarker = warpMarkers[nextWrapMarkerIndex - 1]
    const nextWrapMarker = warpMarkers[nextWrapMarkerIndex]
    const beatTimeRatio = (beatTime - previousWrapMarker.beatTime) / (nextWrapMarker.beatTime - previousWrapMarker.beatTime)
    const secTime = previousWrapMarker.secTime + beatTimeRatio * (nextWrapMarker.secTime - previousWrapMarker.secTime)

    return new Time(Tone.Time(secTime))
  }

}
