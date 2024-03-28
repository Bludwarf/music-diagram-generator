import {WarpMarker} from "./warp-marker";
import {Loop} from "./loop";

export class AudioClip {

  constructor(private readonly xmlAudioClip: any) {

  }

  get name(): string {
    return this.xmlAudioClip.Name._attributes.Value
  }

  get loop(): Loop {
    return new Loop(this.xmlAudioClip.Loop)
  }

  get duration(): number {
    return +this.xmlAudioClip.SampleRef.DefaultDuration._attributes.Value
  }

  get sampleRate(): number {
    return +this.xmlAudioClip.SampleRef.DefaultSampleRate._attributes.Value
  }

  get wrapMarkers(): WarpMarker[] {
    const xmlWarpMarkers = this.xmlAudioClip.WarpMarkers.WarpMarker as any[];
    return xmlWarpMarkers.map(xmlWarpMarker => new WarpMarker(xmlWarpMarker))
  }

}
