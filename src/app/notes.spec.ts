import {Chord, Chords} from "./notes";
import {Time} from "./time";

describe('Chords', () => {

  it('should create from | Gm | F | Eb | D |', () => {
    const chords = Chords.fromAsciiChords('| Gm | F | Eb | D |')
    expect(chords.length).toBe(4)
    expect(chords.getChordAt(Time.fromValue('0:0'))).toEqual(new Chord('Gm'))
    expect(chords.getChordAt(Time.fromValue('1:0'))).toEqual(new Chord('F'))
    expect(chords.getChordAt(Time.fromValue('2:0'))).toEqual(new Chord('Eb'))
    expect(chords.getChordAt(Time.fromValue('3:0'))).toEqual(new Chord('D'))
    expect(chords.duration.toString()).toEqual('4:0:0')
  });

  it('should create from | Gm F | Eb D |', () => {
    const chords = Chords.fromAsciiChords('| Gm F | Eb D |')
    expect(chords.length).toBe(4)
    expect(chords.getChordAt(Time.fromValue('0:0'))).toEqual(new Chord('Gm'))
    expect(chords.getChordAt(Time.fromValue('0:2'))).toEqual(new Chord('F'))
    expect(chords.getChordAt(Time.fromValue('1:0'))).toEqual(new Chord('Eb'))
    expect(chords.getChordAt(Time.fromValue('1:2'))).toEqual(new Chord('D'))
    expect(chords.duration.toString()).toEqual('2:0:0')
  });

});
