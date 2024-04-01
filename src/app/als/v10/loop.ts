export class Loop {
  constructor(private readonly xml: any) {

  }

  get hiddenLoopStart(): number {
    return +this.xml.HiddenLoopStart._attributes.Value
  }

  get loopEnd(): number {
    return +this.xml.LoopEnd._attributes.Value
  }

  get hiddenLoopEnd(): number {
    return +this.xml.HiddenLoopEnd._attributes.Value
  }
}
