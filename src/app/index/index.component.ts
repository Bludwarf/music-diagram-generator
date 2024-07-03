import {Component} from '@angular/core';
import {RythmBarComponent} from '../rythm-bar/rythm-bar.component';
import {CommonModule, JsonPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FretboardComponent} from '../fretboard/fretboard.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, CommonModule, FormsModule, FretboardComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {

  playlist = [
    'Le jour (le phare)',
    'La femme dragon',
    'Noyer le silence',
    'La 4L',
    'Surcouf',
    'Le résistant',
    'Solitude',
    'Petit Papillon',
    'Nuages blancs',
    'Elle rêve à quoi',
    'Tout foufou',
    'Happy',
  ]

}
