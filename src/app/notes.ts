import {ONE_BAR, Time} from "./time";

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

class Mod12Value {
  readonly value: number;

  constructor(value: number) {
    const modValue = value % 12;
    this.value = modValue >= 0 ? modValue : modValue + 12;
  }

  static getValueFromName(name: string, names: string[]): number {
    const value = names.indexOf(name);
    if (value === -1) throw new Error('invalid name : ' + name);
    return value;
  }

  equals(note: Note): boolean {
    return this.value === note.value;
  }
}

export class Note extends Mod12Value {

  constructor(value: number) {
    super(value);
  }

  static fromName(name: string): Note {
    return new Note(Mod12Value.getValueFromName(name, NOTE_NAMES));
  }

  next(halfsteps: number): Note {
    return new Note(this.value + halfsteps);
  }

  get name(): string {
    return NOTE_NAMES[this.value];
  }

  is(other: Note): boolean {
    return this.value === other.value;
  }

  degreeIn(key: Key): Degree {
    return new Degree(this.value - key.note.value);
  }

  modeIn(key: Key): Mode {
    return new Mode(key.mode.value + this.value - key.note.value);
  }

  override toString(): string {
    return NOTE_NAMES[this.value]
  }
}

export namespace Note {
  export const C = Note.fromName('C')
  export const Cs = Note.fromName('C#')
  export const D = Note.fromName('D')
  export const Eb = Note.fromName('Eb')
  export const E = Note.fromName('E')
  export const F = Note.fromName('F')
  export const Fs = Note.fromName('F#')
  export const Gb = Fs
  export const G = Note.fromName('G')
  export const Ab = Note.fromName('Ab')
  export const A = Note.fromName('A')
  export const Bb = Note.fromName('Bb')
  export const B = Note.fromName('B')
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
    return new Note(Mod12Value.getValueFromName(name, MODE_NAMES));
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
    root?: Note,
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
  export const Gm: Chord = new Chord("Gm", Note.G)
}

/**
 * Exemple : <code>| Gm F | Eb D |</code>
 */
export type AsciiChords = string

/**
 * Exemple : <code>Gm F | Eb D</code>
 */
export type AsciiChordsWithoutBorders = string

export type BarNumber0Indexed = number

export class Chords extends Array<Chord> {

  constructor(
    list: Chord[],
    readonly ascii: AsciiChords,
    readonly duration: Time,
    private readonly chordsByTime: [Time, Chord][] = [], // TODO trier par time asc
  ) {
    super(...list)
  }

  static fromAsciiChords(asciiChords: AsciiChords): Chords {

    const barGroups = this.groupAsciiChordsByBar(asciiChords)

    const chordsList: Chord[] = []
    const chordsByTime: [Time, Chord][] = []

    let time = Time.fromValue(0)
    barGroups.forEach(barAsciiChords => {

      const chordGroups = barAsciiChords.split(' ')
      const chordDuration = ONE_BAR.dividedIn(chordGroups.length)

      chordGroups.forEach(chordGroup => {
        const chord = new Chord(chordGroup)
        chordsList.push(chord)
        chordsByTime.push([time, chord])

        time = time.add(chordDuration)
      })

    })

    return new Chords(chordsList, asciiChords, Time.fromValue(`${barGroups.length}m`), chordsByTime)
  }

  static groupAsciiChordsByBar(asciiChords: AsciiChords): string[] {

    const barGroups = asciiChords.split('|').slice(1, -1).map(x => x.trim())
    if (barGroups.length === 0) {
      throw new Error('Cannot find bars in AsciiChords : ' + asciiChords)
    }
    return barGroups;
  }

  getChordAt(time: Time): Chord | undefined {
    // TODO factoriser avec getCurrentPattern
    const reversedChordsByTime = [...this.chordsByTime].reverse()
    const chordAtTime = reversedChordsByTime.find(([chordTime]) => chordTime.isBeforeOrEquals(time));
    return chordAtTime?.[1]
  }

  get first(): Chord {
    return this.chordsByTime[0][1]
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
    return this.chordsByTime.map(([chordTime, chord]) => `${chordTime.toBarsBeatsSixteenths()} ${chord}`).join('\n')
  }

  toAsciiWithoutBorders(): AsciiChordsWithoutBorders {
    return this.ascii
      .substring(1, this.ascii.length - 1)
      .trim()
  }
}
