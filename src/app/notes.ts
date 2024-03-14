import { ONE_BAR, Time } from "./time";

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

/** Tonalité */
export class Key {
  constructor(readonly note: Note, readonly mode: Mode) { }
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
    this.root = Chord.getRootFromName(name)
  }

  static getRootFromName(name: string): Note {
    // TODO faire une vraie détection
    if (NOTE_NAMES.includes(name)) {
      return Note.fromName(name)
    }
    // TODO gérer '#' -> 's'
    switch (name) {
      case 'Gm':
        return Note.G
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

export type AsciiChords = string

export class Chords {

  constructor(
    private readonly asciiChords: AsciiChords,
    readonly duration: Time,
    private readonly chordsByTime: [Time, Chord][] = [], // TODO trier par time asc
  ) { }

  static fromAsciiChords(asciiChords: AsciiChords): Chords {

    console.log('asciiChords', asciiChords)

    const barGroups = asciiChords.split('|').slice(1, -1).map(x => x.trim())
    if (barGroups.length === 0) {
      throw new Error('Cannot find bars in AsciiChords : ' + asciiChords)
    }

    const chordsByTime: [Time, Chord][] = []

    let time = Time.fromValue(0)
    console.log('barGroups', barGroups)
    barGroups.forEach(barAsciiChords => {

      const chordGroups = barAsciiChords.split(' ')
      const chordDuration = ONE_BAR.dividedIn(chordGroups.length)

      chordGroups.forEach(chordGroup => {
        const chord = new Chord(chordGroup)
        console.log(time.toBarsBeatsSixteenths(), chord.name)
        chordsByTime.push([time, chord])

        time = time.add(chordDuration)
      })

    })

    return new Chords(asciiChords, Time.fromValue(`${barGroups.length}m`), chordsByTime)
  }

  setChordAt(time: Time, chord: Chord) {
    // TODO trier par time asc
    this.chordsByTime.push([time, chord])
  }

  getChordAt(time: Time): Chord | undefined {
    // TODO factoriser avec getCurrentPattern
    const reversedChordsByTime = [... this.chordsByTime].reverse()
    const chordAtTime = reversedChordsByTime.find(([chordTime]) => chordTime.isBeforeOrEquals(time));
    return chordAtTime?.[1]
  }

  get length(): number {
    return this.chordsByTime.length
  }

  toString(): string {
    return this.chordsByTime.map(([chordTime, chord]) => `${chordTime.toBarsBeatsSixteenths()} ${chord}`).join('\n')
  }

  toAscii(): string {
    return this.asciiChords
  }
}
