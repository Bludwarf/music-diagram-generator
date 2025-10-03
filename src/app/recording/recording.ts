import {Time} from "../time";
import {WarpMarker} from "../structure/warp-marker";
import {Builder, error, sum} from "../utils";
import * as Tone from "tone";

export class Recording {
  constructor(
    /** Nom du fichier sans extension */
    readonly name: string,
    readonly sampleDuration: Time,
    readonly sampleBeatTimeDuration: number,
    readonly warpMarkers: WarpMarker[],
    private readonly originalWarpMarkersLength = warpMarkers.length, // à cause de normalizeWarpMarker
    readonly midi?: Midi,
  ) {
    this.normalizeWarpMarker()
  }

  static builder(): RecordingBuilder {
    return new RecordingBuilder()
  }

  get sampleEndBeatTime(): number {
    return this.sampleBeatTimeDuration + this.warpMarkers[0].beatTime
  }

  private normalizeWarpMarker(): void {
    const lastWarpMarker = this.warpMarkers[this.warpMarkers.length - 1]
    const missingSampleEndWarpMarker = lastWarpMarker.beatTime < this.sampleEndBeatTime
    if (missingSampleEndWarpMarker) {
      // Pour simplifier le code de getWarpPosition(), on ajoute systématiquement un WarpMarker à la fin du sample
      if (this.sampleBeatTimeDuration < lastWarpMarker.beatTime) {
        // TODO pour le moment on laisse passer, car certains morceaux n'ont pas de sampleBeatTimeDuration valides ("Noyer le silence"), ce qui est peut-être normal
        console.warn(`La durée du sample en BeatTime (${this.sampleBeatTimeDuration}) doit être supérieure au BeatTime du dernier WarpMarker (${lastWarpMarker.beatTime})`)
      } else {
        this.warpMarkers.push(new WarpMarker(this.sampleDuration.toSeconds(), this.sampleEndBeatTime))
      }
    }
  }

  getWarpPosition(seconds: number): Time {

    const warpMarkers = this.warpMarkers

    if (seconds < warpMarkers[0].secTime) {
      throw new Error('Impossible de trouver la position avant le 1er WarpMarker');
    }

    if (seconds > warpMarkers[warpMarkers.length - 1].secTime) {
      throw new Error('Impossible de trouver la position après le dernier WarpMarker');
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

    const warpMarkers = this.warpMarkers

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

  /**
   * On ignore tout ce qu'il y a avant le premier warpMarker et après le dernier.
   * On calcule la moyenne pondérée par le temps (secTime) des tempos entre chaque warpMarker.
   * @return le tempo moyen en BPM
   */
  get meanTempo(): number {
    const weightedBps = this.regions
      .map(region => region.bps * region.secDuration)
      .reduce(sum, 0)
    const start = this.warpMarkers[0];
    const end = this.warpMarkers[this.originalWarpMarkersLength - 1];
    return weightedBps / (end.secTime - start.secTime) * 60
  }

  get regions() {
    const regions: Region[] = []
    for (let endIndex = 1; endIndex < this.originalWarpMarkersLength; ++endIndex) {
      const start = this.warpMarkers[endIndex - 1];
      const end = this.warpMarkers[endIndex];
      regions.push(new Region(start, end))
    }
    return regions;
  }
}

// TODO type pour le MIDI : https://github.com/Tonejs/Midi
export type Midi = {
  header: MidiHeader;
  tracks: MidiTrack[]
};
export type MidiHeader = {
  ppq: number;
}
export type MidiTrack = {
  notes: MidiNote[];
}
export type MidiNote = {
  duration: number;
  durationTicks: number;
  midi: number;
  name: string;
  ticks: number;
  time: number;
  velocity: number;
}

class RecordingBuilder implements Builder<Recording> {
  private _initData?: RecordingInitData;
  private _midi?: Midi;

  initData(dto: typeof this._initData): this {
    this._initData = dto
    return this
  }

  // TODO type pour le MIDI
  midi(midi: Midi): this {
    this._midi = midi
    return this
  }

  build(): Recording {
    if (!this._initData) {
      throw new Error('Missing DTO')
    }
    return new Recording(
      this._initData.name,
      Time.fromValue(this._initData.sampleDuration),
      this._initData.sampleBeatTimeDuration,
      this._initData.warpMarkers,
      undefined,
      this._midi,
    )
  }
}

export interface RecordingInitData {
  /**
   * Nom du sample
   */
  name: string;

  /**
   * Durée du sample original en secondes.
   */
  sampleDuration: number

  /**
   * Durée totale du sample en battements (BeatTime).
   */
  sampleBeatTimeDuration: number

  warpMarkers: WarpMarker[]
}

class Region {
  constructor(
    readonly start: WarpMarker,
    readonly end: WarpMarker,
  ) {
  }

  get beatDuration(): number {
    return this.end.beatTime - this.start.beatTime
  }

  get secDuration(): number {
    return this.end.secTime - this.start.secTime
  }

  /**
   * @return Beats Per Second
   */
  get bps(): number {
    return this.beatDuration / this.secDuration
  }

  /**
   * @return Beats Per Minute
   */
  get bpm(): number {
    return this.bps * 60
  }
}
