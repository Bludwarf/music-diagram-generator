import { Component } from '@angular/core';
import { FretboardComponent } from '../fretboard/fretboard.component';
import { FormsModule } from '@angular/forms';
import { MODE_NAMES, Mode, Key, NOTE_NAMES, Note } from '../notes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sandbox',
  standalone: true,
  imports: [CommonModule, FormsModule, FretboardComponent],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss',
})
export class SandboxComponent {
  firstFretboardLowestFret = 0;
  firstFretboardFretsCount = 5;

  firstFretboardRootValue = Note.fromName('G').value;
  get firstFretboardRoot(): Note {
    return new Note(this.firstFretboardRootValue);
  }

  firstFretboardRootModeValue = Mode.fromName('vi').value;
  get firstFretboardRootMode(): Mode {
    return new Mode(this.firstFretboardRootModeValue);
  }

  get firstFretboardKey(): Key {
    return new Key(this.firstFretboardRoot, this.firstFretboardRootMode);
  }

  NOTE_NAMES = NOTE_NAMES;
  MODE_NAMES = MODE_NAMES;
}
