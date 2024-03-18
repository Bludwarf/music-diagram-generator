import {Component} from '@angular/core';
import {RythmBarComponent} from '../rythm-bar/rythm-bar.component';
import {CommonModule, JsonPipe} from '@angular/common';
import {StructureComponent} from '../structure/structure.component';
import {FormsModule} from '@angular/forms';
import {FretboardComponent} from '../fretboard/fretboard.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-rythm-sandbox',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, StructureComponent, CommonModule, FormsModule, FretboardComponent, RouterLink],
  templateUrl: './rythm-sandbox.component.html',
  styleUrl: './rythm-sandbox.component.scss',
})
export class RythmSandboxComponent {

  playlist = [
    'Petit Papillon',
    'Surcouf',
    'La femme dragon',
    'Le jour (le phare)',
    'Le résistant',
    'Noyer le silence',
    'Nuages blancs',
  ]

  constructor() {
  }

}
