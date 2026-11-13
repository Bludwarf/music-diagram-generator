import {BeatTime} from "../../time";

export class Locator {
    public readonly time: BeatTime;

    constructor(private readonly parsedXml: any) {
        this.time = new BeatTime(this.parsedXml.Time._attributes.Value);
    }

    get name(): string {
        return this.parsedXml.Name._attributes.Value;
    }

}
