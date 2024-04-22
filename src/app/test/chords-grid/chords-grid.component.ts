import { Component } from '@angular/core';
import { BarNumber0Indexed, Chords } from '../../notes';
import { ChordsGridComponent as AppChordsGridComponent } from '../../rehearsal/mobile/chords-grid/chords-grid.component';

@Component({
  selector: 'app-test-chords-grid',
  standalone: true,
  imports: [AppChordsGridComponent],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss'
})
export class ChordsGridComponent {
  chords = Chords.fromAsciiChords('| Gm | Bb | F | F |')
}
