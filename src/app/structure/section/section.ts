import {Pattern} from "../pattern/pattern";
import {BaseColor as Color} from "../../color";
import {arraySum} from "../../utils";

export class Section {

    private _durationInBars?: number

    constructor(
        readonly name: string,
        readonly patterns: Pattern[],
        readonly initial?: string,
        readonly color?: Color,
    ) {
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            if (!pattern) {
                throw new Error(`Pattern [${i}] non défini pour la section ${name}`);
            }
        }
    }

    get durationInBars(): number {
        this._durationInBars ??= arraySum(this.patterns.map(p => p.durationInBars));
        return this._durationInBars
    }

}
