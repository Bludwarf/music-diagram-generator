import * as Tone from "tone";
import {TimeClass} from "tone";
import {Transport} from "tone/build/esm/core/clock/Transport";
import {TimeValue} from "tone/build/esm/core/type/TimeBase";

// TODO Attention valable uniquement en 4/4, sinon il faudra utiliser TimeClass avec un BaseContext
export class Time {

  constructor(
    protected readonly _toneTime: TimeClass = Tone.Time(0),
  ) {
  }

  static fromValue(value?: TimeValue): Time {
    return new this(Tone.Time(value))
  }

  static fromTransport(transport: Transport): Time {
    // TODO utiliser time pour être plus précis ?
    return new this(Tone.Time(transport.position)) // TODO OK ?
  }

  /**
   * @param beatTime Cf. Ableton Live WarpMarker.BeatTime
   */
  static fromBeatTime(beatTime: number): Time {
    // TODO uniquement pour une signature 4/4
    const bars = Math.floor(beatTime / 4)
    const beats = Math.floor(beatTime) - bars * 4
    const sixteenths = beatTime % 1 * 4

    const barsBeatsSixteenth = `${bars}:${beats}:${sixteenths}`;
    // console.log('wrappedPosition', barsBeatsSixteenth, new Time(Tone.Time(barsBeatsSixteenth)).toBarsBeatsSixteenths())

    return new Time(Tone.Time(barsBeatsSixteenth))
  }

  private static fromFields(fields: BarsBeatsSixteenthsFields): Time {
    return Time.fromValue(fieldsToString(fields))
  }

  add(time: Time): Time {
    const thisFields = this.toBarsBeatsSixteenthsFields()
    const timeFields = time.toBarsBeatsSixteenthsFields()
    const sumFields: BarsBeatsSixteenthsFields = {
      bars: thisFields.bars + timeFields.bars,
      beats: thisFields.beats + timeFields.beats,
      sixteenths: thisFields.sixteenths + timeFields.sixteenths,
    }
    return Time.fromFields(sumFields)
  }

  dividedIn(divider: number): Time {
    const fields = this.toBarsBeatsSixteenthsFields()
    const dividedFields: BarsBeatsSixteenthsFields = {
      bars: fields.bars / divider,
      beats: fields.beats / divider,
      sixteenths: fields.sixteenths / divider,
    }
    return Time.fromFields(dividedFields)
  }

  relativeTo(startTime: Time): Time {
    // TODO à tester
    // console.log('relativeTime', startTime.toBarsBeatsSixteenths(), this.toBarsBeatsSixteenths(), new Time(Tone.Time(this.toSeconds() - startTime.toSeconds(), 's')).toBarsBeatsSixteenths())
    return new Time(Tone.Time(this.toSeconds() - startTime.toSeconds(), 's'))
  }

  compareTo(time: Time): number {
    return this.toSeconds() - time.toSeconds()
  }

  isBefore(time: Time): boolean {
    return this.compareTo(time) < 0
  }

  isBeforeOrEquals(time: Time): boolean {
    return this.compareTo(time) <= 0
  }

  isAfterOrEquals(time: Time): boolean {
    return this.compareTo(time) >= 0
  }

  toBarsBeatsSixteenths(): string {
    return this._toneTime.toBarsBeatsSixteenths()
  }

  toBars(): number {
    // TODO arrondi OK ?
    return this.toBarsBeatsSixteenthsFields().bars
  }

  private toBarsBeatsSixteenthsFields(): BarsBeatsSixteenthsFields {
    const fields = this._toneTime.toBarsBeatsSixteenths().split(':');
    return {
      bars: +fields[0],
      beats: +fields[1],
      sixteenths: +fields[2],
    }
  }

  toAbletonLiveBarsBeatsSixteenths(): string {
    const fields = this.toBarsBeatsSixteenthsFields();
    ++fields.bars
    ++fields.beats
    // TODO pour être plus précis, il faudrait utiliser time, puis le convertir en relatif à transport.position
    fields.sixteenths = Math.floor(fields.sixteenths) + 1
    return fieldsToString(fields, '.')
  }

  toAbletonLiveBeatTime(): number {
    const fields = this.toBarsBeatsSixteenthsFields();
    const bars = fields.bars
    const beats = fields.beats
    // TODO pour être plus précis, il faudrait utiliser time, puis le convertir en relatif à transport.position
    const sixteenths = Math.floor(fields.sixteenths)
    return bars * 4 + beats + sixteenths / 4 // TODO uniquement en 4/4
  }

  toSeconds(): number {
    return this._toneTime.toSeconds();
  }

  toString(): string {
    return this.toBarsBeatsSixteenths()
  }

  mod(bars: number): Time {
    const fields = this.toBarsBeatsSixteenthsFields()
    fields.bars = fields.bars % bars
    return Time.fromFields(fields)
  }

  toBeatTime() {
    const fields = this.toBarsBeatsSixteenthsFields()
    // TODO uniquement en 4/4
    return fields.bars * 4 + fields.beats
  }
}

export const ONE_BAR = Time.fromValue('1m')

interface BarsBeatsSixteenthsFields {
  bars: number
  beats: number
  sixteenths: number
}

function fieldsToString(fields: BarsBeatsSixteenthsFields, separator = ':'): string {
  return `${fields.bars}${separator}${fields.beats}${separator}${fields.sixteenths}`
}

