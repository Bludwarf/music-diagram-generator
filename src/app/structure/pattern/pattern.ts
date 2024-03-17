import * as Tone from 'tone'
import {Time} from '../../time';
import {AsciiChords, Chords, Key} from '../../notes';
import {TimeValue} from 'tone/build/esm/core/type/TimeBase';

export class Pattern {

  constructor(
    readonly name: string,
    readonly duration: Time,
    readonly initial?: string,
    readonly key?: Key,
    readonly chords?: Chords,
    readonly events?: any,
    readonly fretboard?: FretboardData,
  ) {
  }

  static fromData(data: PatternInitData): Pattern {
    const chords = data.chords ? Chords.fromAsciiChords(data.chords) : undefined
    const getDurationFrom = (chords: Chords | undefined) => {
      if (!chords) {
        throw new Error('Missing duration')
      }
      return chords.duration
    }
    return new Pattern(
      data.name,
      data.duration ? new Time(Tone.Time(data.duration)) : getDurationFrom(chords),
      data.initial,
      data.key,
      chords,
      data.events,
      data.fretboard,
    );
  }

}

export interface PatternInitData {
  name: string
  duration?: TimeValue
  initial?: string
  key?: Key
  chords?: AsciiChords
  events?: any
  fretboard?: FretboardData
}

export interface FretboardData {
  lowestFret?: number
  fretsCount?: number
}
