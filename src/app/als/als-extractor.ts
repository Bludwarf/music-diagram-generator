import {AlsProject} from "./v10/als-project";
import {AudioTrack} from "./v10/audio-track";
import {AudioClip} from "./v10/audio-clip";
import {WarpMarker} from "../structure/warp-marker";
import {RecordingDto} from "../recording/recording-dto";

export class AlsExtractor {

  constructor(private readonly alsProject: AlsProject) {

  }

  get originalAudioTrack(): AudioTrack {
    return this.alsProject.audioTracks[0]
  }

  get originalAudioClip(): AudioClip {
    return this.originalAudioTrack.audioClips[0]
  }

  get sampleDurationInSeconds(): number {
    const duration = this.originalAudioClip.duration
    const sampleRate = this.originalAudioClip.sampleRate
    return duration / sampleRate
  }

  get sampleBeatTimeDuration(): number {
    const end = Math.max(this.originalAudioClip.loop.hiddenLoopEnd, this.originalAudioClip.loop.loopEnd)
    return end - this.originalAudioClip.loop.hiddenLoopStart
  }

  get warpMarkers(): WarpMarker[] {
    return this.originalAudioClip.wrapMarkers.map(wrapMarker => new WarpMarker(wrapMarker.secTime, wrapMarker.beatTime))
  }

  extractStructureObject(): StructureObject {
    return {
      sampleDuration: this.sampleDurationInSeconds,
      warpMarkers: this.warpMarkers,
    }
  }

  extractRecordingDto(): RecordingDto {
    return {
      name: this.originalAudioClip.name,
      sampleDurationInSeconds: this.sampleDurationInSeconds,
      sampleBeatTimeDuration: this.sampleBeatTimeDuration,
      warpMarkers: this.warpMarkers,
    }
  }

}

export interface StructureObject {
  /**
   * Durée du sample original en secondes.
   */
  sampleDuration: number

  /**
   * BeatTime à la tout fin du sample observée dans Ableton Live.
   */
  sampleBeatTimeDuration?: number

  warpMarkers: WarpMarker[]
}
