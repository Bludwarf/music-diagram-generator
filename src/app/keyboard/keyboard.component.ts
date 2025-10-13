// Source : https://github.com/imagicbell/piano-app/blob/master/src/features/keyboard/index.js

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {allNotes, CalcNotePositions, MAX_NOTE, MIN_NOTE, NotePositions, NoteType} from "./notes";
import {ActiveKey} from "./type";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {KeyboardAdapter} from "./keyboard-adapter";
import {OctavedNote} from "../notes";

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardComponent implements OnInit, OnChanges {
  @Input()
  activeKeys: ActiveKey[] = [];

  @Input()
  markedKeyNames: string[] = [];

  /**
   * @deprecated Semble poser des problèmes sur certaines notes.
   * Utiliser plutôt lowerOctavedNote.
   */
  @Input()
  lowerKey: string = MIN_NOTE; // TODO nommage incohérent

  /**
   * @deprecated Semble poser des problèmes sur certaines notes.
   * Utiliser plutôt higherOctavedNote.
   */
  @Input()
  higherKey: string = MAX_NOTE; // TODO nommage incohérent

  @Input()
  set lowerOctavedNote(lowerOctavedNote: OctavedNote | undefined) {
    if (lowerOctavedNote) {
      this.lowerKey = this.keyboardAdapter.adaptNoteNameForKeyboardState(lowerOctavedNote, 'down')
    }
  }

  @Input()
  set higherOctavedNote(higherOctavedNote: OctavedNote | undefined) {
    if (higherOctavedNote) {
      this.higherKey = this.keyboardAdapter.adaptNoteNameForKeyboardState(higherOctavedNote, 'up')
    }
  }

  /**
   * Pour donner une indication sur le radius à appliquer à chaque touche
   */
  @Input() keyHeightInPx: number | undefined;

  whiteKeys: NoteType[];
  blackKeys: NoteType[];
  private notePositions: NotePositions;

  @Output()
  playKey = new EventEmitter<string>();
  @Output()
  stopKey = new EventEmitter<string>();

  constructor(
    private readonly keyboardAdapter: KeyboardAdapter,
  ) {
    this.whiteKeys = [];
    this.blackKeys = [];
    this.notePositions = CalcNotePositions(allNotes);
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    const lowerNote = this.findNote(this.lowerKey);
    const higherNote = this.findNote(this.higherKey);
    const notes = allNotes.filter(note => note.midi >= lowerNote.midi && note.midi <= higherNote.midi);

    this.whiteKeys = notes.filter(note => note.type === 'white');
    this.blackKeys = notes.filter(note => note.type === 'black');
    this.notePositions = CalcNotePositions(notes);
  }

  ngOnChanges(changes: SimpleChanges) {
    const activeKeysChange = 'activeKeys' in changes
    const propertyChanged = Object.keys(changes).length;
    if (!activeKeysChange || propertyChanged > 1) {
      this.init();
    }
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
      'border-radius': this.computeRadius(5),
    }
  };

  getBlackKeyStyle(note: NoteType) {
    const pos = this.notePositions.leftPositions.find(lp => lp.ansi === note.ansi);
    return {
      width: `${this.notePositions.blackWidth}%`,
      left: pos ? `${pos.left}%` : undefined,
      'border-radius': this.computeRadius(5),
    }
  }

  private computeRadius(baseRadius: number) {
    const baseHeight = 350;
    const radiusFactor = baseRadius / baseHeight
    const radiusInPx = radiusFactor * (this.keyHeightInPx ?? baseHeight)
    return `0 0 ${radiusInPx}px ${radiusInPx}px`;
  }

  pressKey = (note: NoteType) => {
    this.playKey.emit(note.ansi);
  }

  releaseKey = (note: NoteType) => {
    this.stopKey.emit(note.ansi);
  }
}
