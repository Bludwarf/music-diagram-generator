import {Component} from '@angular/core';
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {CommonModule, JsonPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {PatternComponent} from "../../../structure/pattern/pattern.component";
import {SectionComponent} from "../../../structure/section/section.component";

@Component({
  selector: 'app-mobile-rehearsal-b-maq',
  standalone: true,
  imports: [
    RythmBarComponent, JsonPipe, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent
  ],
  templateUrl: './mobile-rehearsal-b.component.html',
  styleUrl: './mobile-rehearsal-b.component.scss'
})
export class MobileRehearsalBMaqComponent {

}
