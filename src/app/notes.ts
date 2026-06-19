import {Position, PositionedElement, PositionFormatter, TimeSignature} from "./time";
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
    // TODO utiliser from
    static readonly C = new Key(Note.C)
    static readonly Cs = new Key(Note.Cs)
    static readonly D = new Key(Note.D)
    static readonly Eb = new Key(Note.Eb)
    static readonly E = new Key(Note.E)
    static readonly F = new Key(Note.F)
    static readonly Fs = new Key(Note.Fs)
    static readonly G = new Key(Note.G)
    static readonly Ab = new Key(Note.Ab)
    static readonly A = new Key(Note.A)
    static readonly Bb = new Key(Note.Bb)

    static readonly Cm = new Key(Note.C, Mode.vi)
    static readonly Csm = new Key(Note.Cs, Mode.vi)
    static readonly Dm = new Key(Note.D, Mode.vi)
    static readonly Ebm = new Key(Note.Eb, Mode.vi)
    static readonly Em = new Key(Note.E, Mode.vi)
    static readonly Fm = new Key(Note.F, Mode.vi)
    static readonly Fsm = new Key(Note.Fs, Mode.vi)
    static readonly Gm = new Key(Note.G, Mode.vi)
    static readonly Abm = new Key(Note.Ab, Mode.vi)
    static readonly Am = new Key(Note.A, Mode.vi)
    static readonly Bbm = new Key(Note.Bb, Mode.vi)

    private static readonly KEYS_BY_NOTE_VALUE_AND_MODE_VALUE: Key[][] = [];

    private constructor(readonly note: Note, readonly mode: Mode = Mode.I) {
    }

    static from(note: Note, mode: Mode): Key {
        if (!(note.value in this.KEYS_BY_NOTE_VALUE_AND_MODE_VALUE)) {
            this.KEYS_BY_NOTE_VALUE_AND_MODE_VALUE[note.value] = [];
        }
        const keysNotesByModeValue = this.KEYS_BY_NOTE_VALUE_AND_MODE_VALUE[note.value];

        if (!(mode.value in keysNotesByModeValue)) {
            keysNotesByModeValue[mode.value] = new Key(note, mode);
        }

        return keysNotesByModeValue[mode.value];
    }
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

interface PositionedChord extends PositionedElement {
    chord: Chord;
}

export class Chords extends Array<Chord> {

    constructor(
        list: Chord[],
        readonly ascii: AsciiChords, // utilisé pour l'export JSON
        readonly durationInBars: number,
        private readonly chordsByPosition: [Position, Chord | undefined][],
        /** Optionnel si on a une durée d'une seule mesure */
        private readonly chordsByBar ?: Record<number, Chords>,
        private readonly barTimeSignatureGetter ?: BarTimeSignatureGetter,
    ) {
        super();
        if (durationInBars !== 1 && list.length > 0 && !chordsByBar) error(`chordsByBar est obligatoire car la durée des accords est différente de 1`)
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
        const chordsByBar: Record<number, Chords> = {}

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
                    return position.addBeats(chordBeatDuration, barTimeSignature)
                }
            }

            const bar: BarNumber0Indexed = position.bars
            let barPosition = new Position()
            const barChordsList: Chord[] = []
            const barChordsByPosition: [Position, Chord | undefined][] = []

            chordGroups.forEach(chordGroup => {
                const chord = chordGroup ? new Chord(chordGroup) : undefined;
                if (chord) {
                    chordsList.push(chord)
                    barChordsList.push(chord)
                }
                chordsByPosition.push([position, chord])
                barChordsByPosition.push([position, chord])

                position = next(position)
                barPosition = next(barPosition)
            })

            chordsByBar[bar] = new Chords(
                barChordsList,
                `| ${barAsciiChords} |`,
                1,
                barChordsByPosition,
                undefined,
                barTimeSignatureGetter,
            );

        })

        return new Chords(chordsList, asciiChords, barGroups.length, chordsByPosition, chordsByBar, barTimeSignatureGetter)
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

    private _positionedChords?: PositionedChord[]
    private get positionedChords(): PositionedChord[] {
        if (!this._positionedChords) {
            const positionedChords: PositionedChord[] = [];
            for (let i = 0; i < this.chordsByPosition.length; i++) {
                const [position, chord] = this.chordsByPosition[i];
                const nextPosition = i + 1 < this.chordsByPosition.length ? this.chordsByPosition[i + 1][0] : new Position(this.durationInBars);
                if (chord) {
                    positionedChords.push({
                        chord,
                        startPosition: position,
                        endPosition: nextPosition,
                    })
                }
            }
            this._positionedChords = positionedChords;
        }
        return this._positionedChords;
    }

    getChordAt(position: Position): Chord | undefined {
        const positionedChord = Position.getElementAt(position, this.positionedChords, false);
        return positionedChord?.chord
    }

    getChordsAtBar(bar: BarNumber0Indexed): Chords | undefined {
        if (this.chordsByBar) {
            return this.chordsByBar[bar]
        } else if (bar === 0 && this.durationInBars === 1) {
            return this;
        } else {
            return undefined;
        }
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
