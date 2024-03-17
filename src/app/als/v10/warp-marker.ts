export class WarpMarker {
  constructor(private readonly xmlWarpMarker: any) {
  }

  get secTime(): number {
    return +this.xmlWarpMarker._attributes.SecTime
  }

  get beatTime(): number {
    return +this.xmlWarpMarker._attributes.BeatTime
  }

}
