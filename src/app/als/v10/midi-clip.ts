import {BeatTime} from "../../time";
import {XmlWrapper} from "./xml-wrapper";

export class MidiClip extends XmlWrapper {

    public readonly currentStart: BeatTime;
    public readonly currentEnd: BeatTime;

    constructor(xmlObject: any) {
        super(xmlObject);
        this.currentStart = new BeatTime(this.xmlObject.CurrentStart._attributes.Value);
        this.currentEnd = new BeatTime(this.xmlObject.CurrentEnd._attributes.Value);
    }

    get name(): string {
        return this.xmlObject.Name?._attributes?.Value
    }

    get loopOn(): boolean {
        const value = this.xmlObject.Loop.LoopOn._attributes.Value as string;
        return value.toLowerCase() === 'true';
    }

    get loopStart(): number {
        return this.getNumberValue(this.xmlObject.Loop.LoopStart);
    }

    get loopEnd(): number {
        return this.getNumberValue(this.xmlObject.Loop.LoopEnd);
    }

}
