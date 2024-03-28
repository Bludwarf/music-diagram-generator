import {AlsProject} from "./v10/als-project";
import {AudioTrack} from "./v10/audio-track";
import {Time} from "../time";
import {AudioClip} from "./v10/audio-clip";
import {WarpMarker} from "../structure/warp-marker";
import {RecordingInitData} from "../recording/recording";

export class AlsExtractor {

  constructor(private readonly alsProject: AlsProject) {

  }

  get originalAudioTrack(): AudioTrack {
    return this.alsProject.audioTracks[0]
  }

  get originalAudioClip(): AudioClip {
    return this.originalAudioTrack.audioClips[0]
  }

  get sampleDuration(): Time {
    const duration = this.originalAudioClip.duration
    const sampleRate = this.originalAudioClip.sampleRate
    return Time.fromValue(duration / sampleRate)
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
      sampleDuration: this.sampleDuration.toSeconds(),
      warpMarkers: this.warpMarkers,
    }
  }

  extractRecordingInitData(): RecordingInitData {
    return {
      name: this.originalAudioClip.name,
      sampleDuration: this.sampleDuration.toSeconds(),
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
