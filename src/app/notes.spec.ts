import {Chord, Chords, Mode, Note, OctavedNote} from "./notes";
import {Position} from "./time";

const C = Note.C
const Cs = Note.Cs
const Db = Note.Db
const D = Note.D
const Ds = Note.Ds
const Eb = Note.Eb
const E = Note.E
const F = Note.F
const Fs = Note.Fs
const Gb = Note.Gb
const G = Note.G
const Gs = Note.Gs
const Ab = Note.Ab
const A = Note.A
const As = Note.As
const Bb = Note.Bb
const B = Note.B

describe('Note', () => {

    it('equals', () => {
        expect(C.equals(C)).toBeTrue();
        expect(Cs.equals(Db)).toBeTrue();
    });

    it('should convert sharp to flat', () => {
        expect(C.toString('b')).toEqual('C');
        expect(Cs.toString('b')).toEqual('Db');
        expect(Db.toString('b')).toEqual('Db');
        expect(D.toString('b')).toEqual('D');
        expect(Ds.toString('b')).toEqual('Eb');
        expect(Eb.toString('b')).toEqual('Eb');
        expect(E.toString('b')).toEqual('E');
        expect(F.toString('b')).toEqual('F');
        expect(Fs.toString('b')).toEqual('Gb');
        expect(Gb.toString('b')).toEqual('Gb');
        expect(G.toString('b')).toEqual('G');
        expect(Gs.toString('b')).toEqual('Ab');
        expect(Ab.toString('b')).toEqual('Ab');
        expect(A.toString('b')).toEqual('A');
        expect(As.toString('b')).toEqual('Bb');
        expect(Bb.toString('b')).toEqual('Bb');
        expect(B.toString('b')).toEqual('B');
    });

    it('should convert flat to sharp', () => {
        expect(C.toString('#')).toEqual('C');
        expect(Cs.toString('#')).toEqual('C#');
        expect(Db.toString('#')).toEqual('C#');
        expect(D.toString('#')).toEqual('D');
        expect(Ds.toString('#')).toEqual('D#');
        expect(Eb.toString('#')).toEqual('D#');
        expect(E.toString('#')).toEqual('E');
        expect(F.toString('#')).toEqual('F');
        expect(Fs.toString('#')).toEqual('F#');
        expect(Gb.toString('#')).toEqual('F#');
        expect(G.toString('#')).toEqual('G');
        expect(Gs.toString('#')).toEqual('G#');
        expect(Ab.toString('#')).toEqual('G#');
        expect(A.toString('#')).toEqual('A');
        expect(As.toString('#')).toEqual('A#');
        expect(Bb.toString('#')).toEqual('A#');
        expect(B.toString('#')).toEqual('B');
    });

    it('transpose', () => {
        expect(C.transpose(-1)).toBe(B);
        expect(C.transpose(0)).toBe(C);
        expect(C.transpose(1)).toBe(Cs);
        expect(Cs.transpose(-1)).toBe(C);
        expect(Db.transpose(-1)).toBe(C);
    });

});

describe('Mode', () => {

    ([
        ["I", 0],
        ["bii", 1],
        ["ii", 2],
        ["biii", 3],
        ["iii", 4],
        ["IV", 5],
        ["bV", 6],
        ["V", 7],
        ["bvi", 8],
        ["vi", 9],
        ["bvii", 10],
        ["vii", 11],
    ] as [string, number][]).forEach(([name, value]) => {
        it(`${name} -> ${value}`, () => {
            const mode = Mode.fromName(name);
            expect(mode.value).toEqual(value);
            expect(Mode.fromValue(value)).toBe(mode); // test du cache
            expect(Mode.fromName(name)).toBe(mode); // test du cache
        });
    })

});

describe('Chord', () => {

    it('should get root from chord Am', () => {
        expect(Chord.getRootFromName('Am')).toBe(Note.A);
    });

    it('should get root from chord Gb', () => {
        expect(Chord.getRootFromName('Gb')).toBe(Note.Gb);
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

    it('should create from | Gm F | Eb D |', () => {
        const chords = Chords.fromAsciiChords('| Gm F | Eb D |', () => [4, 4])
        expect(chords.length).toBe(4)
        expect(chords.getChordAt2(new Position(0))).toEqual(new Chord('Gm'))
        expect(chords.getChordAt2(new Position(0, 2))).toEqual(new Chord('F'))
        expect(chords.getChordAt2(new Position(1))).toEqual(new Chord('Eb'))
        expect(chords.getChordAt2(new Position(1, 2))).toEqual(new Chord('D'))
        expect(chords.durationInBars).toEqual(2)
    });

    it('should get chords at bar 1 from | Gm F | Eb D | @ 4/4', () => {
        const chords = Chords.fromAsciiChords('| Gm F | Eb D |', () => [4, 4])
        const barChords = chords.getChordsAtBar(0);
        expect(barChords).toBeDefined();

        expect(barChords?.ascii).toEqual('| Gm F |')
    });

    it('should get chords at bar 1 from | Gm F | Eb D | @ 6/8', () => {
        const chords = Chords.fromAsciiChords('| Gm F | Eb D |', () => [6, 8])
        const barChords = chords.getChordsAtBar(0);
        expect(barChords).toBeDefined();

        expect(barChords?.ascii).toEqual('| Gm F |')
    });

    it('should get chords duration from | Gm F | @ 4/4', () => {
        const chords = Chords.fromAsciiChords('| Gm F |', () => [4, 4])
        expect(chords.durationInBars).toEqual(1)
    });

    it('should get chords duration from | Gm F | @ 6/8', () => {
        const chords = Chords.fromAsciiChords('| Gm F |', () => [6, 8])
        expect(chords.durationInBars).toEqual(1)
    });

    it('should get chords by indices from | Gm F | Eb D |', () => {
        const chords = Chords.fromAsciiChords('| Gm F | Eb D |', () => [4, 4])
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
        expect(OctavedNote.fromMidiName('A0')).toEqual(new OctavedNote(A, 0));
        expect(OctavedNote.fromMidiName('C8')).toEqual(new OctavedNote(C, 8));
        expect(OctavedNote.fromMidiName('A#4')).toEqual(new OctavedNote(As, 4));
        expect(OctavedNote.fromMidiName('Ab4')).toEqual(new OctavedNote(Ab, 4));
    });

    it('should get OctavedNote from MidiNoteValue', () => {
        expect(OctavedNote.fromMidi(21)).toEqual(new OctavedNote(A, 0));
        expect(OctavedNote.fromMidi(108)).toEqual(new OctavedNote(C, 8));
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

    it('should convert flat to sharp', () => {
        expect(OctavedNote.fromMidiName('Bb1').toString('#')).toEqual('A#1');
    });

});
