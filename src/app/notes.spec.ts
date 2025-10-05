import {Chord, Chords, Note, OctavedNote} from "./notes";
import {Position} from "./time";

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
    expect(chords.getChordAt2(new Position(0))).toEqual(new Chord('Gm'))
    expect(chords.getChordAt2(new Position(1))).toEqual(new Chord('F'))
    expect(chords.getChordAt2(new Position(2))).toEqual(new Chord('Eb'))
    expect(chords.getChordAt2(new Position(3))).toEqual(new Chord('D'))
    expect(chords.durationInBars).toEqual(4)
  });

  // TODO TU Position pour avoir '0:0:0' == '0:0' == '0'

  it('should create from | Gm F | Eb D |', () => {
    const chords = Chords.fromAsciiChords('| Gm F | Eb D |')
    expect(chords.length).toBe(4)
    expect(chords.getChordAt2(new Position(0))).toEqual(new Chord('Gm'))
    expect(chords.getChordAt2(new Position(0, 2))).toEqual(new Chord('F'))
    expect(chords.getChordAt2(new Position(1))).toEqual(new Chord('Eb'))
    expect(chords.getChordAt2(new Position(1, 2))).toEqual(new Chord('D'))
    expect(chords.durationInBars).toEqual(2)
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

  it('should create from | Gm | | Eb |', () => {
    const chords = Chords.fromAsciiChords('| Gm | | Eb |')
    expect(chords.length).toBe(2)
    expect(chords.getChordAt2(new Position(0))).toEqual(new Chord('Gm'))
    expect(chords.getChordAt2(new Position(1))).toBeUndefined();
    expect(chords.getChordAt2(new Position(2))).toEqual(new Chord('Eb'))
    expect(chords.durationInBars).toEqual(3)
  });

  it('should create 4 bars without chord', () => {
    const chords = Chords.repeatNoChord(4)
    expect(chords.length).toBe(0)
    expect(chords.getChordAt2(new Position(0))).toBeUndefined();
    expect(chords.getChordAt2(new Position(1))).toBeUndefined();
    expect(chords.getChordAt2(new Position(2))).toBeUndefined();
    expect(chords.getChordAt2(new Position(3))).toBeUndefined();
    expect(chords.durationInBars).toEqual(4)
  });

});

describe('OctavedNote', () => {

  it('should get OctavedNote from MidiNoteName', () => {
    expect(OctavedNote.fromMidiName('A0')).toEqual(new OctavedNote(Note.fromName('A'), 0));
    expect(OctavedNote.fromMidiName('C8')).toEqual(new OctavedNote(Note.fromName('C'), 8));
    expect(OctavedNote.fromMidiName('A#4')).toEqual(new OctavedNote(Note.fromName('A#'), 4));
    expect(OctavedNote.fromMidiName('Ab4')).toEqual(new OctavedNote(Note.fromName('Ab'), 4));
  });

  it('should get OctavedNote from MidiNoteValue', () => {
    expect(OctavedNote.fromMidi(21)).toEqual(new OctavedNote(Note.fromName('A'), 0));
    expect(OctavedNote.fromMidi(108)).toEqual(new OctavedNote(Note.fromName('C'), 8));
  });

  it('should get midi', () => {
    expect(OctavedNote.fromMidi(21).midi).toEqual(21);
    expect(OctavedNote.fromMidi(108).midi).toEqual(108);
  });

  it('should transpose', () => {
    expect(OctavedNote.fromMidiName('A1').transpose(12)).toEqual(OctavedNote.fromMidiName('A2'));
    expect(OctavedNote.fromMidiName('A1').transpose(48)).toEqual(OctavedNote.fromMidiName('A5'));
    expect(OctavedNote.fromMidiName('C2').transpose(-1)).toEqual(OctavedNote.fromMidiName('B1'));
    expect(OctavedNote.fromMidiName('C2').transpose(-13)).toEqual(OctavedNote.fromMidiName('B0'));
  });

});
