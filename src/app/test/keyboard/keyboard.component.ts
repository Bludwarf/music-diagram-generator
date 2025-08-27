// Source : https://github.com/imagicbell/piano-app/blob/master/src/features/keyboard/index.js

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {allNotes, CalcNotePositions, NotePositions, NoteType} from "./notes";
import {ActiveKey} from "./type";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardComponent implements OnInit {
  @Input()
  activeKeys: ActiveKey[] = [];

  @Input()
  lowerKey: string = 'A0';

  @Input()
  higherKey: string = 'C8';

  @Input()
  fitContent = true;

  whiteKeys: NoteType[];
  blackKeys: NoteType[];
  private notePositions: NotePositions;

  @Output()
  playKey = new EventEmitter<string>();
  @Output()
  stopKey = new EventEmitter<string>();

  constructor() {
    this.whiteKeys = [];
    this.blackKeys = [];
    this.notePositions = CalcNotePositions(allNotes);
  }

  ngOnInit() {
    const lowerNote = this.findNote(this.lowerKey);
    const higherNote = this.findNote(this.higherKey);
    const notes = allNotes.filter(note => note.midi >= lowerNote.midi && note.midi <= higherNote.midi);

    this.whiteKeys = notes.filter(note => note.type === 'white');
    this.blackKeys = notes.filter(note => note.type === 'black');
    this.notePositions = CalcNotePositions(notes);
  }

  private findNote(key: string): NoteType {
    const note = allNotes.find(note => note.ansi === key);
    if (!note) {
      throw new Error(`Unknown note from key ${key}`)
    }
    return note;
  }

  getKeyNgClass(key: NoteType): {} {
    return {
      ['key-' + key.type]: true,
      ['key-' + key.type + '-active']: this.activeKeys.findIndex(k => k.name === key.ansi) >= 0
    }
  }

  get whiteKeyStyle() {
    return {
      width: `${this.notePositions.whiteWidth}%`,
    }
  };

  getBlackKeyStyle(note: NoteType) {
    let pos = this.notePositions.leftPositions.find(lp => lp.ansi === note.ansi);
    return {
      width: `${this.notePositions.blackWidth}%`,
      left: pos ? `${pos.left}%` : undefined,
    }
  }

  pressKey = (note: NoteType) => {
    this.playKey.emit(note.ansi);
  }

  releaseKey = (note: NoteType) => {
    this.stopKey.emit(note.ansi);
  }
}
