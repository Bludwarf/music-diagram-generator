import {Component} from '@angular/core';
import {MobileRehearsalAComponent} from "../rehearsal/mobile/mobile-rehearsal-a/mobile-rehearsal-a.component";

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [
    MobileRehearsalAComponent
  ],
  templateUrl: './song.component.html',
  styleUrl: './song.component.scss',
})
export class SongComponent {
}
