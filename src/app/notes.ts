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
  constructor(readonly note: Note, readonly mode: Mode) {}
}


export class Degree extends Mod12Value {
  constructor(value: number) {
    super(value);
  }
}