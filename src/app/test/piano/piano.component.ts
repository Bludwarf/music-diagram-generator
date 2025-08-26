import {ChangeDetectionStrategy, Component} from '@angular/core';
import {KeyboardComponent} from "../keyboard/keyboard.component";

@Component({
  selector: 'app-piano',
  standalone: true,
  imports: [
    KeyboardComponent
  ],
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PianoComponent {}
