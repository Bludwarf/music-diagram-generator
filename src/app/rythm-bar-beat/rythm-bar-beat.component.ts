import { Component, EventEmitter, Input, Output } from '@angular/core';
import { sequence } from '../utils';
import { CommonModule } from '@angular/common';
import { RythmBarBeatDivisionComponent } from '../rythm-bar-beat-division/rythm-bar-beat-division.component';
import { RythmBarEvent } from '../rythm-bar/event';

@Component({
  selector: 'app-rythm-bar-beat',
  standalone: true,
  imports: [
    CommonModule,
    RythmBarBeatDivisionComponent,
  ],
  templateUrl: './rythm-bar-beat.component.html',
  styleUrl: './rythm-bar-beat.component.scss'
})
export class RythmBarBeatComponent {

  @Input()
  number = 1

  @Input()
  barNumber = 1

  @Input()
  beatDivision = 4

  @Input()
  events: RythmBarEvent[] = []

  @Output()
  addEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  @Output()
  removeEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  private _beatDivisionArray?: number[];
  protected get beatDivisionArray(): number[] {
    if (!this._beatDivisionArray) {
      this._beatDivisionArray = sequence(this.beatDivision, 1);
    }
    return this._beatDivisionArray;
  }
}
