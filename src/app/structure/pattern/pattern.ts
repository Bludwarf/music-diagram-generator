import * as Tone from 'tone'
import { Time } from '../../time';
import { Key } from '../../notes';

export class Pattern {

    constructor(
        readonly name: string,
        readonly duration: Time,
        readonly initial?: string,
        readonly key?: Key,
    ) {
    }

}
