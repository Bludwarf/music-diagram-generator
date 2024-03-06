import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { sequence } from '../utils';
import { RythmBarBeatDivisionLineComponent } from '../rythm-bar-beat-division-line/rythm-bar-beat-division-line.component';
import { NoteComponent } from './note/note.component';
import { RythmBarEvent } from '../rythm-bar/event';

@Component({
  selector: 'app-rythm-bar-beat-division',
  standalone: true,
  imports: [CommonModule, RythmBarBeatDivisionLineComponent, NoteComponent],
  templateUrl: './rythm-bar-beat-division.component.html',
  styleUrl: './rythm-bar-beat-division.component.scss',
})
export class RythmBarBeatDivisionComponent {
  @Input()
  number = 1;

  @Input()
  barNumber = 1;

  @Input()
  beatNumber = 1;

  @Input()
  lines = 2;

  @Input()
  events: RythmBarEvent[] = [];

  @Output()
  addEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  @Output()
  removeEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  get width(): number {
    return this.el.nativeElement.offsetWidth;
  }

  get noteOffsetLeft(): number {
    // TODO trouver dynamiquement
    return 2;
  }

  get noteHeight(): number {
    // TODO trouver la hauteur des lignes dynamiquement
    const tempCorrection = 0.97;
    return (this.width / (12 / 7)) * tempCorrection;
  }

  get eventsOnThisDivision(): RythmBarEvent[] {
    // TODO cache
    return this.events.filter(
      (event) =>
        event.bar === this.barNumber &&
        event.beat === this.beatNumber &&
        event.division == this.number
    );
  }

  get lineBorder(): number {
    // TODO récup dynamique ou par variable
    return 1;
  }

  private _linesArray?: number[];
  protected get linesArray(): number[] {
    if (!this._linesArray) {
      this._linesArray = sequence(this.lines);
    }
    return this._linesArray;
  }

  constructor(private readonly el: ElementRef) {}

  /**
   * Basé sur 1 pour faciliter la conversion en booléen
   */
  line(event: RythmBarEvent): number {
    switch (event.note) {
      case 'kick':
        return this.lines;
      case 'snare':
        return this.lines - 1;
      default:
        throw new Error('Unknown note ' + event.note);
    }
  }

  /**
   * Réciproque de line
   */
  note(line: number): string {
    switch (line) {
      case this.lines:
        return 'kick';
      case this.lines - 1:
        return 'snare';
      default:
        throw new Error('Unknown line ' + line);
    }
  }

  onClickLine(line: RythmBarBeatDivisionLineComponent): void {
    const existingEvent = line.event
    if (existingEvent) {
      return this.removeEvent.emit(existingEvent);
    }

    const note = this.note(line.lineIndex + 1);
    const event = new RythmBarEvent(
      this.barNumber,
      this.beatNumber,
      line.beatDivisionNumber,
      note
    );
    this.addEvent.emit(event);
  }

}
