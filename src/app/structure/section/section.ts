import {Pattern} from "../pattern/pattern";
import {Time} from "../../time";

export class Section {

  private _duration?: Time

  constructor(
    readonly name: string,
    readonly patterns: Pattern[],
    readonly initial?: string,
  ) {
  }

  get duration(): Time {
    if (!this._duration) {
      this._duration = Time.sum(this.patterns.map(p => p.duration))
    }
    return this._duration
  }

}
