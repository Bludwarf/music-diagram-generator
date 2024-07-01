import {AudioTrack} from "./audio-track";

export class AlsProject {
  constructor(private readonly parsedXml: any) {

  }
  get audioTracks(): AudioTrack[] {
    const audioTrackElementOrArray = this.parsedXml.Ableton.LiveSet.Tracks.AudioTrack
    const audioTracks = audioTrackElementOrArray.map ? audioTrackElementOrArray : [audioTrackElementOrArray]
    return audioTracks.map((audioTrack: any) => new AudioTrack(audioTrack))
  }

}
