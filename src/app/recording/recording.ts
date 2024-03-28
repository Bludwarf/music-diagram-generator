import {Time} from "../time";
import {WarpMarker} from "../structure/warp-marker";
import {Structure} from "../structure/structure";
import {Builder} from "../utils";

export class Recording {
  constructor(
    readonly structure: Structure,
    readonly sampleDuration: Time,
    readonly warpMarkers: WarpMarker[],
  ) {
  }

  static builder(): RecordingBuilder {
    return new RecordingBuilder()
  }

  get sampleBeatTimeDuration() {
    return this.structure.sampleBeatTimeDuration
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

}

class RecordingBuilder implements Builder<Recording> {
  private _structure?: Structure;
  private _dto?: RecordingDto;

  structure(structure: typeof this._structure): this {
    this._structure = structure
    return this
  }

  dto(dto: typeof this._dto): this {
    this._dto = dto
    return this
  }

  build(): Recording {
    if (!this._structure) {
      throw new Error('Missing structure')
    }
    if (!this._dto) {
      throw new Error('Missing DTO')
    }
    return new Recording(
      this._structure,
      Time.fromValue(this._dto.sampleDuration),
      this._dto.warpMarkers,
    )
  }
}

export interface RecordingDto {
  /**
   * Durée du sample original en secondes.
   */
  sampleDuration: number

  warpMarkers: WarpMarker[]
}
