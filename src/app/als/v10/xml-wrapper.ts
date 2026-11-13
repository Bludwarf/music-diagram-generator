export class XmlWrapper {
    constructor(protected readonly xmlObject: any) {
    }

    protected getNumberValue(xmlElement: any): number {
        return Number(xmlElement._attributes.Value);
    }
}
