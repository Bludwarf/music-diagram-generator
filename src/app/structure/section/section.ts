import {Pattern} from "../pattern/pattern";
import {Time} from "../../time";
import {BaseColor as Color} from "../../color";

export class Section {

  private _duration?: Time

  constructor(
    readonly name: string,
    readonly patterns: Pattern[],
    readonly initial?: string,
    readonly color?: Color,
  ) {
    for (let i = 0; i < patterns.length; i++){
      const pattern = patterns[i];
      if (!pattern) {
        throw new Error(`Pattern [${i}] non défini pour la section ${name}`);
      }
    }
  }

  get duration(): Time {
    this._duration ??= Time.sum(this.patterns.map(p => p.duration));
    return this._duration
  }

}
