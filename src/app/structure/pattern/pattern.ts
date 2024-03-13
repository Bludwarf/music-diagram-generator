import * as Tone from 'tone'
import { Time } from '../../time';

export class Pattern {

    constructor(
        readonly name: string,
        readonly duration: Time,
    ) {
    }

}
