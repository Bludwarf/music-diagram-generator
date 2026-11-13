import {AudioTrack} from "./audio-track";
import {Locator} from "./locator";
import {MidiTrack} from "./midi-track";

export class AlsProject {
    constructor(private readonly parsedXml: any) {
    }

    get audioTracks(): AudioTrack[] {
        const audioTrackElementOrArray = this.parsedXml.Ableton.LiveSet.Tracks.AudioTrack
        const audioTrackArray = audioTrackElementOrArray.map ? audioTrackElementOrArray : [audioTrackElementOrArray]
        return audioTrackArray.map((audioTrack: any) => new AudioTrack(audioTrack))
    }

    findMidiTrack(nameRegExp: RegExp): MidiTrack | undefined {
        return this.midiTracks.find(midiTrack => midiTrack.name.match(nameRegExp));
    }

    get midiTracks(): MidiTrack[] {
        const midiTrackElementOrArray = this.parsedXml.Ableton.LiveSet.Tracks.MidiTrack
        const midiTrackArray = midiTrackElementOrArray.map ? midiTrackElementOrArray : [midiTrackElementOrArray]
        return midiTrackArray.map((midiTrack: any) => new MidiTrack(midiTrack))
    }

    get locators(): Locator[] {
        const xmlLocatorArray = this.parsedXml.Ableton.LiveSet.Locators.Locators.Locator as any[];
        return xmlLocatorArray.map(xmlLocator => new Locator(xmlLocator));
    }

}
