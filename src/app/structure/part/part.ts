import {Section} from "../section/section";

export class Part {

  constructor(
    readonly name: string,
    readonly sections: Section[],
  ) {
  }
}
