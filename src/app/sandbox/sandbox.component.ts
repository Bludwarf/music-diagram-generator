import {Component} from '@angular/core';
import {FretboardComponent} from '../fretboard/fretboard.component';
import {FormsModule} from '@angular/forms';
import {Key, Mode, MODE_NAMES, Note, NOTE_NAMES} from '../notes';
import {CommonModule} from '@angular/common';

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

    firstFretboardRootValue = Note.G.value;

    get firstFretboardRoot(): Note {
        return Note.fromValue(this.firstFretboardRootValue);
    }

    firstFretboardRootModeValue = Mode.fromName('vi').value;

    get firstFretboardRootMode(): Mode {
        return Mode.fromValue(this.firstFretboardRootModeValue);
    }

    get firstFretboardKey(): Key {
        return Key.from(this.firstFretboardRoot, this.firstFretboardRootMode);
    }

    NOTE_NAMES = NOTE_NAMES;
    MODE_NAMES = MODE_NAMES;
}
