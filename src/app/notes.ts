import {Position, PositionFormatter, TimeSignature} from "./time";
import {Comparable} from "./utils/comparator";
import {checkIsInteger} from "./utils/validators";
import {error} from "./utils";

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

    static getNaturalValueFromName(naturalName: string, naturalNames: string[]): number {
        if (naturalNames.length !== NATURAL_VALUES.length) error(`Le tableau contenant les noms doit être de longueur ${NATURAL_VALUES.length}`)
        const index = naturalNames.indexOf(naturalName);
        if (index === -1) error(`Invalid naturalName "${naturalName}"`);
        return NATURAL_VALUES[index];
    }

    protected static _fromName<T extends Mod12Value>(name: string, itemsByName: Record<string, T>, naturalNames: string[], tName: string, fromValue: (value: number) => T): T {
        if (!(name in itemsByName)) {
            const naturalName = name.replace(/[b#s]/, "")
            const naturalValue = this.getNaturalValueFromName(naturalName, naturalNames);
            if (naturalValue === undefined) {
                throw new Error(`Unknown natural ${tName} name ` + naturalValue);
            }

            let value = naturalValue;
            for (const car of name) {
                if (car === 'b') {
                    --value
                } else if (car === '#') {
                    ++value
                }
            }

            itemsByName[name] = fromValue(value)
        }
        return itemsByName[name]
    }

    equals(note: Note): boolean {
        return this.value === note.value;
    }

    compareTo(other: Mod12Value): number {
        return this.value - other.value;
    }
}

const NATURAL_VALUES: number[] = [
    0,
    2,
    4,
    5,
    7,
    9,
    11,
]

export class Note extends Mod12Value {

    private static readonly NATURAL_NOTE_NAMES = [
        "C",
        "D",
        "E",
        "F",
        "G",
        "A",
        "B",
    ]
    private static readonly NOTES_BY_VALUE: Note[] = []
    private static readonly NOTES_BY_NAME: Record<string, Note> = {}

    static readonly C = Note.fromName('C')
    static readonly Cs = Note.fromName('C#')
    static readonly Db = Note.Cs
    static readonly D = Note.fromName('D')
    static readonly Eb = Note.fromName('Eb')
    static readonly Ds = Note.Eb
    static readonly E = Note.fromName('E')
    static readonly F = Note.fromName('F')
    static readonly Fs = Note.fromName('F#')
    static readonly Gb = Note.Fs
    static readonly G = Note.fromName('G')
    static readonly Ab = Note.fromName('Ab')
    static readonly Gs = Note.Ab
    static readonly A = Note.fromName('A')
    static readonly Bb = Note.fromName('Bb')
    static readonly As = Note.Bb
    static readonly B = Note.fromName('B')

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
        return this._fromName(name, this.NOTES_BY_NAME, this.NATURAL_NOTE_NAMES, "note", value => this.fromValue(value))
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
        return Mode.fromValue(key.mode.value + this.value - key.note.value);
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

    private static readonly NATURAL_MODE_NAMES = [
        "I",
        "ii",
        "iii",
        "IV",
        "V",
        "vi",
        "vii",
    ]
    private static readonly MODES_BY_VALUE: Mode[] = []
    private static readonly MODES_BY_NAME: Record<string, Mode> = {}

    private constructor(value: number) {
        super(value);
    }

    /**
     * Utiliser plutôt les constantes (comme {@link Mode#I}) si possible
     */
    static fromValue(value: number): Mode {
        return this._fromValue(value, this.MODES_BY_VALUE, value => new Mode(value));
    }

    /**
     * Utiliser plutôt les constantes (comme {@link Mode#I}) si possible
     */
    static fromName(name: string): Mode {
        return this._fromName(name, this.MODES_BY_NAME, this.NATURAL_MODE_NAMES, "mode", value => this.fromValue(value))
    }

    get name(): string {
        return MODE_NAMES[this.value];
    }
}

export namespace Mode {
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

export type BarTimeSignatureGetter = (bar: number) => TimeSignature

export class Chords extends Array<Chord> {

    constructor(
        list: Chord[],
        readonly ascii: AsciiChords, // utilisé pour l'export JSON
        readonly durationInBars: number,
        private readonly chordsByPosition: [Position, Chord | undefined][],
        private readonly barTimeSignatureGetter ?: BarTimeSignatureGetter,
    ) {
        super();
        this.push(...list);
    }

    /**
     * @param asciiChords Liste des accords au format ASCII
     * @param barTimeSignatureGetter Nécessaire uniquement si une mesure contient plusieurs accords
     */
    static fromAsciiChords(asciiChords: AsciiChords, barTimeSignatureGetter ?: BarTimeSignatureGetter): Chords {

        const barGroups = this.groupAsciiChordsByBar(asciiChords)

        const chordsList: Chord[] = []
        const chordsByPosition: [Position, Chord | undefined][] = []

        let position = new Position()
        barGroups.forEach(barAsciiChords => {

            const chordGroups = barAsciiChords.split(' ')
            const next = (position: Position) => {
                if (chordGroups.length === 1) {
                    return position.addBars(1)
                } else {
                    if (!barTimeSignatureGetter) error(`La mesure ${position.bars + 1} contient ${chordGroups.length} accords, il est donc nécessaire de préciser sa signature rythmique`)
                    const barTimeSignature = barTimeSignatureGetter(position.bars)
                    const beatsPerBar = barTimeSignature[0]
                    const chordBeatDuration = this.getChordBeatDuration(chordGroups.length, beatsPerBar);
                    return position.addBeats(chordBeatDuration, beatsPerBar)
                }
            }

            chordGroups.forEach(chordGroup => {
                const chord = chordGroup ? new Chord(chordGroup) : undefined;
                if (chord) {
                    chordsList.push(chord)
                }
                chordsByPosition.push([position, chord])

                position = next(position)
            })

        })

        return new Chords(chordsList, asciiChords, barGroups.length, chordsByPosition, barTimeSignatureGetter)
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

    getChordAt(position: Position): Chord | undefined {
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
        return Chords.fromAsciiChords(`| ${chordGroups[bar]} |`, this.barTimeSignatureGetter);
    }

    override toString(): string {
        return this.chordsByPosition.map(([position, chord]) => `${PositionFormatter.DEBUG.format(position)} ${chord}`).join('\n')
    }

    private static getChordBeatDuration(numberOfChordsInOneBar: number, beatsPerBar: number): number {
        return beatsPerBar / numberOfChordsInOneBar;
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
