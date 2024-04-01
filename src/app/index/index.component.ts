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
    'Petit Papillon',
    'Surcouf',
    'La femme dragon',
    'Le jour (le phare)',
    'Le résistant',
    'Noyer le silence',
    'Nuages blancs',
  ]

}
