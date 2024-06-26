import {Chord, Chords, Note} from "./notes";
import {Time} from "./time";

describe('Chord', () => {

  it('should get root from chord Am', () => {
    expect(Chord.getRootFromName('Am')).toEqual(Note.A);
  });

  it('should get root from chord Gb', () => {
    expect(Chord.getRootFromName('Gb')).toEqual(Note.Gb);
  });

});

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

  it('should get chords at bar 1 from | Gm F | Eb D |', () => {
    const chords = Chords.fromAsciiChords('| Gm F | Eb D |')
    const barChords = chords.getChordsAtBar(0);
    expect(barChords).toBeDefined();

    expect(barChords?.ascii).toEqual('| Gm F |')
  });

  it('should get chords by indices from | Gm F | Eb D |', () => {
    const chords = Chords.fromAsciiChords('| Gm F | Eb D |')
    expect(chords[0].toString()).toEqual('Gm')
    expect(chords[1].toString()).toEqual('F')
    expect(chords[2].toString()).toEqual('Eb')
    expect(chords[3].toString()).toEqual('D')
    expect(chords).toHaveSize(4)
  });

});
