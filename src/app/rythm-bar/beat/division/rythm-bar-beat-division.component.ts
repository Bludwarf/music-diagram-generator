import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { sequence } from '../../../utils';
import { NoteComponent } from './note/note.component';
import { RythmBarEvent } from '../../event';
import { debounceTime, fromEvent, tap } from 'rxjs';
import { RythmBarBeatDivisionLineComponent } from './line/rythm-bar-beat-division-line.component';

@Component({
  selector: 'app-rythm-bar-beat-division',
  standalone: true,
  imports: [CommonModule, RythmBarBeatDivisionLineComponent, NoteComponent],
  templateUrl: './rythm-bar-beat-division.component.html',
  styleUrl: './rythm-bar-beat-division.component.scss',
})
export class RythmBarBeatDivisionComponent implements AfterViewInit {
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

  // TODO utiliser un timecode relatif plutôt qu'absolu ?
  @Input()
  timecode?: string;

  @Output()
  addEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  @Output()
  removeEvent: EventEmitter<RythmBarEvent> = new EventEmitter();

  @ViewChildren(RythmBarBeatDivisionLineComponent)
  lineComponents?: QueryList<RythmBarBeatDivisionLineComponent>;

  displayNotes = false

  @HostBinding('class.active')
  get active(): boolean {
    if (!this.timecode) {
      return false;
    }

    // TODO faire une classe pour décomposer chaque champ
    const fields = this.timecode.split('.');
    const barNumber = +fields[0]
    const beatNumber = +fields[1]
    const sixteenthNumber = +fields[2]

    return barNumber === this.barNumber && beatNumber === this.beatNumber && sixteenthNumber === this.number;
  }

  get width(): number {
    return this.widthV2;
  }

  get top(): number {
    return this.el.nativeElement.getBoundingClientRect().top;
  }

  private get widthV1(): number {
    return this.el.nativeElement.offsetWidth;
  }
  private get widthV2(): number {
    return this.el.nativeElement.getBoundingClientRect().width;
  }

  getNoteOffsetTop(line: number): number {
    return this.getNoteOffsetTopV2(line);
  }

  private getNoteOffsetTopV1(line: number): number {
    const tempCorrection = 0.97;
    const noteHeight = (this.width / (12 / 7)) * tempCorrection;
    const lineBorder = 1;
    return (line - 1) * (noteHeight + lineBorder);
  }

  private getNoteOffsetTopV2(line: number): number {
    if (this.lineComponents) {
      const minLineComponent = this.minLineComponent(line);
      if (minLineComponent?.top !== undefined) {
        const maxLineComponent = this.maxLineComponent(line);
        console.log(minLineComponent, minLineComponent.top, this.top)
        if (maxLineComponent === minLineComponent) {
          return minLineComponent.top - this.top;
        } else if (maxLineComponent?.top !== undefined) {
          const ratio = line % 1;
          return (minLineComponent.top - this.top) + (maxLineComponent.top - this.top) * ratio;
        }
      }
    }

    console.warn('Impossible de calculer getNoteOffsetTopV2 => on utilise getNoteOffsetTopV1');
    return this.getNoteOffsetTopV1(line);
  }

  private lineComponent(line: number): RythmBarBeatDivisionLineComponent | undefined {
    return this.lineComponents?.get(line - 1);
  }

  private minLineComponent(line: number): RythmBarBeatDivisionLineComponent | undefined {
    return this.lineComponent(Math.floor(line));
  }

  private maxLineComponent(line: number): RythmBarBeatDivisionLineComponent | undefined {
    return this.lineComponent(Math.ceil(line));
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

  private _linesArray?: number[];
  protected get linesArray(): number[] {
    if (!this._linesArray) {
      this._linesArray = sequence(this.lines);
    }
    return this._linesArray;
  }

  constructor(
    private readonly el: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
    this.detectChangesOnWindowResize();
    setTimeout(() => this.displayNotes = true)
  }

  private detectChangesOnWindowResize() {
    // TODO il suffit de souscrire pour déclencher une détection de changement ? : https://stackoverflow.com/questions/35527456/angular-window-resize-event
    fromEvent(window, 'resize').pipe(
      tap(() => console.log('window resize')),
      debounceTime(1000),
      tap(() => console.log('debounced window resize'))
    ).subscribe();
  }

  /**
   * Basé sur 1 pour faciliter la conversion en booléen
   */
  line(event: RythmBarEvent): number {
    // TODO à mettre dans un composant fonctionnel, qui interprète les events
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
