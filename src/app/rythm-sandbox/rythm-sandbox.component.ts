import { Component } from '@angular/core';
import { RythmBarComponent } from '../rythm-bar/rythm-bar.component';
import { IRythmBarEvent, RythmBarEvent } from '../rythm-bar/event';
import { JsonPipe } from '@angular/common';
import events from '../../assets/events/Petit Papillon/events.json';

@Component({
  selector: 'app-rythm-sandbox',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe],
  templateUrl: './rythm-sandbox.component.html',
  styleUrl: './rythm-sandbox.component.scss',
})
export class RythmSandboxComponent {
  events: RythmBarEvent[] = RythmBarEvent.fromEach(events);

  constructor() {
    console.log(events);
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
}
