import {Injectable, NgZone} from "@angular/core";
import * as Tone from "tone";
import {Loop} from "tone";
import {Seconds, Time, TransportTime} from "tone/Tone/core/type/Units";

@Injectable({
  providedIn: 'root'
})
export class ToneAdapter {

  constructor(
    private readonly ngZone: NgZone,
  ) {
  }

  loop(callback?: (time: Seconds) => void, interval?: Time): Loop {
    return new Tone.Loop(time => {
      this.ngZone.run(() => {
        callback?.(time)
      })
    }, interval)
  }

  schedule(callback: TransportCallback, time: TransportTime/* TODO  | TransportTimeClass */) {
    Tone.Transport.schedule(time => {
      this.ngZone.run(() => {
        callback?.(time)
      })
    }, time);
  }
}

// Source : ToneJs
type TransportCallback = (time: Seconds) => void;
