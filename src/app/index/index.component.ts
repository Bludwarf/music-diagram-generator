import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    'Rockollection',
    'Tout foufou',
    'Happy',
    'The Sims - If You Really See Eurydice'
  ]

}
