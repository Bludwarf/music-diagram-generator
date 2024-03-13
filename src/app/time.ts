import { TimeClass } from "tone";
import { TimeBaseUnit, TimeValue } from "tone/build/esm/core/type/TimeBase";
import * as Tone from 'tone'
import { Transport } from "tone/build/esm/core/clock/Transport";


export class Time {

    constructor(
        private readonly _toneTime: TimeClass = Tone.Time(0),
    ) {
    }

    static fromTransport(transport: Transport): any {
        // TODO utiliser time pour être plus précis ?
        return new this(Tone.Time(transport.position)) // TODO OK ?
    }

    add(time: Time): Time {
        const seconds = this.toSeconds() + time.toSeconds()
        return new Time(Tone.Time(seconds, 's'))
    }

    isBefore(time: Time): boolean {
        return this.toSeconds() < time.toSeconds()
    }

    toBarsBeatsSixteenths(): string {
        return this._toneTime.toBarsBeatsSixteenths()
    }

    toAbletonLiveBarsBeatsSixteenths(): string {
        const fields = this._toneTime.toBarsBeatsSixteenths().split(':');
        const bars = +fields[0] + 1
        const beats = +fields[1] + 1
        // TODO pour être plus précis, il faudrait utiliser time, puis le convertir en relatif à transport.position
        const sixteenths = Math.floor(+fields[2]) + 1
        return `${bars}:${beats}:${sixteenths}`
    }

    toSeconds(): number {
        return this._toneTime.toSeconds();
    }
}
