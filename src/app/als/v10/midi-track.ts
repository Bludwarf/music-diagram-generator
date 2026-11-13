import {MidiClip} from "./midi-clip";
import {BeatTime} from "../../time";

export class MidiTrack {
    constructor(private readonly xmlObject: any) {
    }

    get name(): string {
        return this.xmlObject.Name.UserName._attributes.Value;
    }

    get midiClips(): MidiClip[] {
        const xmlMidiClipArray = this.xmlObject.DeviceChain.MainSequencer.ClipTimeable.ArrangerAutomation.Events.MidiClip as any[];
        return xmlMidiClipArray.map(xmlMidiClip => new MidiClip(xmlMidiClip));
    }

    get end(): BeatTime {
        return new BeatTime(this.midiClips.reduce((sum, midiClip) => Math.max(sum, midiClip.currentEnd.value), 0));
    }

}
