import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RythmBarBeatComponent } from '../rythm-bar-beat/rythm-bar-beat.component';
import { CommonModule } from '@angular/common';
import { sequence } from '../utils';
import { RythmBarEvent } from './event';

@Component({
  selector: 'app-rythm-bar',
  standalone: true,
  imports: [
    CommonModule,
    RythmBarBeatComponent,
  ],
  templateUrl: './rythm-bar.component.html',
  styleUrl: './rythm-bar.component.scss'
})
export class RythmBarComponent {

  @Input()
  number = 1

  @Input()
  beats = 4

  @Input()
  beatDivision = 4

  @Input()
  events: RythmBarEvent[] = []

  // TODO utiliser un timecode relatif plutôt qu'absolu ?
  @Input()
  timecode?: string;

  @Output()
  addEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  @Output()
  removeEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  private _beatsArray?: number[];
  protected get beatsArray(): number[] {
    if (!this._beatsArray) {
      this._beatsArray = sequence(this.beats, 1);
    }
    return this._beatsArray;
  }
}
