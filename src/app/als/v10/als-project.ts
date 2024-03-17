import {AudioTrack} from "./audio-track";

export class AlsProject {
  constructor(private readonly parsedXml: any) {

  }
  get audioTracks(): AudioTrack[] {
    return this.parsedXml.Ableton.LiveSet.Tracks.AudioTrack.map((audioTrack: any) => new AudioTrack(audioTrack))
  }

}
