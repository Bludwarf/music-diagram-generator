// Source : https://github.com/imagicbell/piano-app/blob/master/src/features/keyboard/index.js

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CalcNotePositions, NotePositions, notes, NoteType} from "./notes";
import {ActiveKey} from "./type";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardComponent {
  @Input()
  activeKeys: ActiveKey[] = [];

  readonly whiteKeys: NoteType[];
  readonly blackKeys: NoteType[];
  private notePositions: NotePositions;

  @Output()
  playKey = new EventEmitter<string>();
  @Output()
  stopKey = new EventEmitter<string>();

  constructor() {
    this.whiteKeys = notes.filter(note => note.type === 'white');
    this.blackKeys = notes.filter(note => note.type === 'black');
    this.notePositions = CalcNotePositions();
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
