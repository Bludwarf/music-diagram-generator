import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Key, Mode, Note } from '../notes';
import { Fretboard } from './fretboard';

@Component({
  selector: 'app-fretboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fretboard.component.html',
  styleUrl: './fretboard.component.scss',
})
export class FretboardComponent implements OnInit, OnChanges {
  @Input()
  lowestFret = 0

  startingNote = Note.fromName('E')
  stringInterval = new Note(5)
  stringsCount = 4

  @Input()
  fretsCount = 5

  @Input()
  key? = new Key(Note.fromName('C'), Mode.fromName('I'))

  @Input()
  currentNote?: Note

  fretboard?: Fretboard;

  ngOnInit(): void {
    this.buildFretboard()
  }

  private buildFretboard(): void {
    this.fretboard = Fretboard.create({
      startingNote: this.startingNote,
      stringInterval: this.stringInterval,
      stringsCount: this.stringsCount,
      lowestFret: this.lowestFret,
      fretsCount: this.fretsCount,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildFretboard()
  }
}

class FretboardNote extends Note {
  constructor(readonly string: Note, readonly fret: number) {
    super(string.value + fret)
  }
}
