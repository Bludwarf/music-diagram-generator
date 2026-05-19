import {Position, PositionFormatter} from "./time";
import {Comparable} from "./utils/comparator";
import {checkIsInteger} from "./utils/validators";

export const NOTE_NAMES = [
    'C',
    'C#',
    'D',
    'Eb',
    'E',
    'F',
    'F#',
    'G',
    'Ab',
    'A',
    'Bb',
    'B',
];

class Mod12Value implements Comparable<Mod12Value> {
    readonly value: number;

    constructor(value: number) {
        this.value = Mod12Value.modValue(value);
    }

    static modValue(value: number): number {
        const modValue = value % 12;
        return modValue >= 0 ? modValue : modValue + 12;
    }

    protected static _fromValue<T extends Mod12Value>(value: number, itemsByValue: Record<number, T>, constructor: (value: number) => T): T {
        value = Mod12Value.modValue(value)
        if (!(value in itemsByValue)) {
            itemsByValue[value] = constructor(value)
        }
        return itemsByValue[value]
    }

    static getValueFromName(name: string, names: string[]): number {
        const value = names.indexOf(name);
        if (value === -1) throw new Error('invalid name : ' + name);
        return value;
    }

    equals(note: Note): boolean {
        return this.value === note.value;
    }

    compareTo(other: Mod12Value): number {
        return this.value - other.value;
    }
}

const NATURAL_NOTE_VALUE_BY_NAME: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
}

export class Note extends Mod12Value {
    private static NOTES_BY_VALUE: Note[] = []
    private static NOTES_BY_NAME: Record<string, Note> = {}

    static C = Note.fromName('C')
    static Cs = Note.fromName('C#')
    static Db = Note.Cs
    static D = Note.fromName('D')
    static Eb = Note.fromName('Eb')
    static Ds = Note.Eb
    static E = Note.fromName('E')
    static F = Note.fromName('F')
    static Fs = Note.fromName('F#')
    static Gb = Note.Fs
    static G = Note.fromName('G')
    static Ab = Note.fromName('Ab')
    static Gs = Note.Ab
    static A = Note.fromName('A')
    static Bb = Note.fromName('Bb')
    static As = Note.Bb
    static B = Note.fromName('B')

    protected constructor(value: number) {
        super(value);
    }

    /**
     * Utiliser plutôt les constantes (comme {@link Note#C Note.C}) si possible
     */
    static fromValue(value: number): Note {
        return this._fromValue(value, this.NOTES_BY_VALUE, value => new Note(value));
    }

    /**
     * Utiliser plutôt les constantes (comme {@link Note#C Note.C}) si possible
     */
    static fromName(name: string): Note {
        if (!(name in this.NOTES_BY_NAME)) {
            const naturalName = name[0]
            const naturalValue = NATURAL_NOTE_VALUE_BY_NAME[naturalName];
            if (naturalValue === undefined) {
                throw new Error('Unknown natural note name ' + naturalValue);
            }

            let value = naturalValue;
            for (let alteration of name.substring(1)) {
                if (alteration === 'b') {
                    --value
                } else if (alteration === '#') {
                    ++value
                } else {
                    throw new Error('Unknown alteration ' + alteration)
                }
            }

            this.NOTES_BY_NAME[name] = this.fromValue(value)
        }
        return this.NOTES_BY_NAME[name]
    }

    transpose(halfsteps: number): Note {
        return Note.fromValue(this.value + halfsteps);
    }

    get name(): string {
        return NOTE_NAMES[this.value];
    }

    degreeIn(key: Key): Degree {
        return new Degree(this.value - key.note.value);
    }

    modeIn(key: Key): Mode {
        return new Mode(key.mode.value + this.value - key.note.value);
    }

    override toString(forcedAlteration?: 'b' | '#'): string {
        if (forcedAlteration) {
            let naturalNote: Note | undefined
            if (forcedAlteration === 'b') {
                if (this.value === 1 || this.value === 6) {
                    naturalNote = this.transpose(1)
                }
            }
            if (forcedAlteration === '#') {
                if (this.value === 3 || this.value === 8 || this.value === 10) {
                    naturalNote = this.transpose(-1)
                }
            }
            if (naturalNote) {
                return naturalNote + forcedAlteration
            }
        }
        return this.name
    }
}

export const MODE_NAMES = [
    'I',
    'bii',
    'ii',
    'biii',
    'iii',
    'IV',
    'bV',
    'V',
    'bvi',
    'vi',
    'bvii',
    'vii',
];

export class Mode extends Mod12Value {
    constructor(value: number) {
        super(value);
    }

    static fromName(name: string): Mode {
        // TODO cache comme Note
        return new Mode(Mod12Value.getValueFromName(name, MODE_NAMES));
    }

    static fromValue(value: number): Mode {
        // TODO cache comme Note
        return new Mode(value);
    }

    get name(): string {
        return MODE_NAMES[this.value];
    }
}

export namespace Mode {
    // TODO utiliser un cache au niveau du constructeur plutôt que de définir des constantes
    export const I = Mode.fromName('I')
    export const vi = Mode.fromName('vi')
}

/** Tonalité */
export class Key {
    constructor(readonly note: Note, readonly mode: Mode = Mode.I) {
    }
}

export namespace Key {
    // TODO utiliser un cache au niveau du constructeur plutôt que de définir des constantes
    export const C = new Key(Note.C)
    export const Cs = new Key(Note.Cs)
    export const D = new Key(Note.D)
    export const Eb = new Key(Note.Eb)
    export const E = new Key(Note.E)
    export const F = new Key(Note.F)
    export const Fs = new Key(Note.Fs)
    export const G = new Key(Note.G)
    export const Ab = new Key(Note.Ab)
    export const A = new Key(Note.A)
    export const Bb = new Key(Note.Bb)

    export const Cm = new Key(Note.C, Mode.vi)
    export const Csm = new Key(Note.Cs, Mode.vi)
    export const Dm = new Key(Note.D, Mode.vi)
    export const Ebm = new Key(Note.Eb, Mode.vi)
    export const Em = new Key(Note.E, Mode.vi)
    export const Fm = new Key(Note.F, Mode.vi)
    export const Fsm = new Key(Note.Fs, Mode.vi)
    export const Gm = new Key(Note.G, Mode.vi)
    export const Abm = new Key(Note.Ab, Mode.vi)
    export const Am = new Key(Note.A, Mode.vi)
    export const Bbm = new Key(Note.Bb, Mode.vi)
}

export class Degree extends Mod12Value {
    constructor(value: number) {
        super(value);
    }
}

export class Chord {

    readonly root: Note

    constructor(
        readonly name: string, // TODO pour l'instant on fait simple
    ) {
        if (!name) {
            throw new Error('name must be non empty')
        }
        this.root = Chord.getRootFromName(name)
    }

    static getRootFromName(name: string): Note {
        // TODO faire une vraie détection
        if (NOTE_NAMES.includes(name)) {
            return Note.fromName(name)
        }
        // TODO gérer '#' -> 's'
        switch (name) {
            case 'Gb':
                return Note.Gb
        }
        const groups = /^([A-G][b#]?)/.exec(name)
        if (groups) {
            return this.getRootFromName(groups[0])
        }
        throw new Error('Cannot find root from ' + name)
    }

    toString(): string {
        return this.name
    }

}

export namespace Chord {
    // TODO utiliser un cache au niveau du constructeur plutôt que de définir des constantes
    export const Gm: Chord = new Chord("Gm")
}

/**
 * Exemple : <code>| Gm F | Eb D |</code>
 */
export type AsciiChords = string

export type BarNumber0Indexed = number

export class Chords extends Array<Chord> {

    constructor(
        list: Chord[],
        readonly ascii: AsciiChords, // utilisé pour l'export JSON
        readonly durationInBars: number,
        private readonly chordsByPosition: [Position, Chord | undefined][],
    ) {
        super();
        this.push(...list);
    }

    static fromAsciiChords(asciiChords: AsciiChords): Chords {

        const barGroups = this.groupAsciiChordsByBar(asciiChords)

        const chordsList: Chord[] = []
        const chordsByPosition: [Position, Chord | undefined][] = []

        let position = new Position()
        barGroups.forEach(barAsciiChords => {

            const chordGroups = barAsciiChords.split(' ')
            const chordBeatDuration = this.getChordBeatDuration(chordGroups.length);

            chordGroups.forEach(chordGroup => {
                const chord = chordGroup ? new Chord(chordGroup) : undefined;
                if (chord) {
                    chordsList.push(chord)
                }
                chordsByPosition.push([position, chord])

                position = position.addBeats(chordBeatDuration, 4) // TODO 4/4 pour l'instant
            })

        })

        return new Chords(chordsList, asciiChords, barGroups.length, chordsByPosition)
    }

    static groupAsciiChordsByBar(asciiChords: AsciiChords): string[] {

        const barGroups = asciiChords.split('|').slice(1, -1).map(x => x.trim())
        if (barGroups.length === 0) {
            throw new Error('Cannot find bars in AsciiChords : ' + asciiChords)
        }
        return barGroups;
    }

    static repeatNoChord(barsDuration: number) {
        checkIsInteger('barsDuration', barsDuration);
        const asciiChords = new Array(barsDuration + 1).fill('|').join(' ')
        return new Chords([], asciiChords, barsDuration, []);
    }

    getChordAt2(position: Position): Chord | undefined {
        // TODO factoriser avec getCurrentPattern et Position.getElementAt
        const reversedChordsByPosition = [...this.chordsByPosition].reverse()
        const chordAtPosition = reversedChordsByPosition.find(([chordTime]) => chordTime.isBeforeOrEquals(position));
        return chordAtPosition?.[1]
    }

    getChordsAtBar(bar: BarNumber0Indexed): Chords | undefined {
        // TODO cache
        const chordGroups = Chords.groupAsciiChordsByBar(this.ascii)
        if (bar > chordGroups.length - 1) {
            console.warn('No chords at bar ' + bar)
            return undefined
        }
        return Chords.fromAsciiChords(`| ${chordGroups[bar]} |`);
    }

    override toString(): string {
        return this.chordsByPosition.map(([position, chord]) => `${PositionFormatter.DEBUG.format(position)} ${chord}`).join('\n')
    }

    private static getChordBeatDuration(numberOfChordsInOneBar: number): number {
        // TODO uniquement en 4/4
        return 4 / numberOfChordsInOneBar;
    }
}

export class OctavedNote implements Comparable<OctavedNote> {
    constructor(
        readonly note: Note,
        readonly octave: number,
    ) {
    }

    get midi(): number {
        return this.note.value + (this.octave + 1) * 12;
    }

    static fromMidiName(midiNoteName: string): OctavedNote {
        const m = /\d$/.exec(midiNoteName);
        if (!m) {
            throw new Error('Nom de note MIDI non reconnu : ' + midiNoteName);
        }
        const octaveString = m[0];
        const noteName = midiNoteName.slice(0, -octaveString.length);
        return new OctavedNote(Note.fromName(noteName), +octaveString);
    }

    static fromMidi(midiNoteValue: number): OctavedNote {
        const octave = Math.floor(midiNoteValue / 12) - 1;
        const noteValue = midiNoteValue % 12;
        return new OctavedNote(Note.fromValue(noteValue), octave);
    }

    transpose(semitones: number): OctavedNote {
        return OctavedNote.fromMidi(this.midi + semitones);
    }

    compareTo(other: OctavedNote): number {
        const octaveComparison = this.octave - other.octave;
        if (octaveComparison !== 0) {
            return octaveComparison;
        }
        return this.note.compareTo(other.note);
    }

    toString(forcedAlteration?: 'b' | '#'): string {
        return this.note.toString(forcedAlteration) + this.octave;
    }
}
