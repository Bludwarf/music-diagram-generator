import { Note } from '../notes';

export class Fretboard {
  constructor(
    readonly strings: ReadonlyArray<Note>,
    readonly lines: ReadonlyArray<FretboardLine>
  ) {}

  static create(config: FretboardConfig): Fretboard {
    const {
      startingNote,
      stringInterval,
      stringsCount,
      lowestFret,
      fretsCount,
    } = config;
    const strings = this.buildStrings(
      startingNote,
      stringInterval,
      stringsCount
    );
    const frets = [...Array(fretsCount).keys()].map(
      (fret) => lowestFret + fret
    );
    const lines = frets.map((fret) => FretboardLine.create(strings, fret));
    return new Fretboard(strings, lines);
  }

  private static buildStrings(
    startingNote: Note,
    stringInterval: Note,
    stringsCount: number
  ): Note[] {
    const stringIndices = [...Array(stringsCount).keys()];
    return stringIndices.map((stringIndex) =>
      startingNote.next(stringIndex * stringInterval.value)
    );
  }
}

export interface FretboardConfig {
  startingNote: Note;
  stringInterval: Note;
  stringsCount: number;
  lowestFret: number;
  fretsCount: number;
}

export class FretboardLine {
  private constructor(
    readonly fret: number,
    readonly notes: ReadonlyArray<FretboardNote>
  ) {}

  static create(strings: Note[], fret: number): FretboardLine {
    const notes = strings.map((string) => new FretboardNote(string, fret));
    return new FretboardLine(fret, notes);
  }
}

export class FretboardNote extends Note {
  constructor(readonly string: Note, readonly fret: number) {
    super(string.value + fret);
  }
}
