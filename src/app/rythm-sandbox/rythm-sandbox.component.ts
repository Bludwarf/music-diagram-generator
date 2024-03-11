import { Component, EventEmitter, Output } from '@angular/core';
import { RythmBarComponent } from '../rythm-bar/rythm-bar.component';
import { IRythmBarEvent, RythmBarEvent } from '../rythm-bar/event';
import { CommonModule, JsonPipe } from '@angular/common';
import events from '../../assets/events/Petit Papillon/events.json';
import { StructureComponent } from '../structure/structure.component';

@Component({
  selector: 'app-rythm-sandbox',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, StructureComponent, CommonModule],
  templateUrl: './rythm-sandbox.component.html',
  styleUrl: './rythm-sandbox.component.scss',
})
export class RythmSandboxComponent {
  events: RythmBarEvent[] = RythmBarEvent.fromEach(events);

  currentPattern?: string;

  constructor() {
    console.log('Events chargés depuis le JSON', events);
  }

  addEvent(event: RythmBarEvent): void {
    this.events.push(event);
    this.logEvents();
  }

  removeEvent(event: RythmBarEvent): void {
    this.events.splice(this.events.indexOf(event), 1);
    this.logEvents();
  }

  logEvents(): void {
    // console.table(this.events)
    console.log(this.events);
  }

  onClickPattern(pattern: string): void {
    this.currentPattern = pattern;
  }
}
