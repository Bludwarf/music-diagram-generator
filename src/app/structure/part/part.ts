import {Section} from "../section/section";

export class Part {
  constructor(
    readonly name: string,
    readonly sections: Section[],
  ) {
  }

  get durationInBars(): number {
    let durationInBars = 0;
    for (const section of this.sections) {
      durationInBars += section.durationInBars
    }
    return durationInBars;
  }
}
