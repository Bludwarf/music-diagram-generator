import {WarpMarker} from "./warp-marker";

export class AudioClip {

  constructor(private readonly xmlAudioClip: any) {

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
