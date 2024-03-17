import {AudioClip} from "./audio-clip";

export class AudioTrack {
  constructor(private readonly xmlObject: any) {
  }

  get audioClips(): AudioClip[] {
    const xmlAudioClip = this.xmlObject.DeviceChain.MainSequencer.Sample.ArrangerAutomation.Events.AudioClip as any;
    return [new AudioClip(xmlAudioClip)]
  }

}
