import { CommonModule } from '@angular/common';
import { Component, EventEmitter, ElementRef, HostBinding, HostListener, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { RythmBarEvent, abletonLiveTimeCode } from '../../../event';

@Component({
  selector: 'app-rythm-bar-beat-division-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rythm-bar-beat-division-line.component.html',
  styleUrl: './rythm-bar-beat-division-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RythmBarBeatDivisionLineComponent {

  // TODO à supprimer ?
  @Input()
  lineIndex = 0

  @Input()
  note = ''

  @Input()
  barNumber = 1

  @Input()
  beatNumber = 1

  @Input()
  beatDivisionNumber = 1

  @Input()
  events: RythmBarEvent[] = []

  @Output()
  clickLine: EventEmitter<this> = new EventEmitter();

  get timeCode(): string {
    return abletonLiveTimeCode(this.barNumber, this.beatNumber, this.beatDivisionNumber)
  }

  @HostBinding('class.on-the-beat')
  get onTheBeat(): boolean {
    return this.beatDivisionNumber == 1
  }

  @Input()
  @HostBinding('class.bottom-line')
  bottomLine?: boolean

  @HostBinding('title')
  get title(): string {
    return this.timeCode
  }

  @Input()
  @HostBinding('class.active')
  active = true

  get event(): RythmBarEvent | undefined {
    return this.events.find(event => event.bar === this.barNumber && event.beat === this.beatNumber && event.division === this.beatDivisionNumber && event.note === this.note);
  }

  @HostListener('click')
  onClick() {
    this.clickLine.emit(this);
    return false;
  }

  get height(): number {
    return this.el.nativeElement.getBoundingClientRect().height;
  }

  get top(): number {
    return this.el.nativeElement.getBoundingClientRect().top;
  }

  constructor(
    private readonly el: ElementRef,
  ) {
  }

}
