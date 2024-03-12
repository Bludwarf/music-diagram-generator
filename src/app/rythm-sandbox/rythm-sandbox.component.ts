import { Component, EventEmitter, Output } from '@angular/core';
import { RythmBarComponent } from '../rythm-bar/rythm-bar.component';
import { IRythmBarEvent, RythmBarEvent } from '../rythm-bar/event';
import { CommonModule, JsonPipe } from '@angular/common';
import events from '../../assets/events/Petit Papillon/events.json';
import { StructureComponent } from '../structure/structure.component';
import * as Tone from 'tone'

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

  private player?: Tone.Player;

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

  async onClickPattern(pattern: string): Promise<void> {
    this.currentPattern = pattern;

    await this.stop();

    // const bView = "https://drive.google.com/file/d/1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj/view?usp=sharing";
    // const bDownload = "https://drive.usercontent.google.com/u/0/uc?id=1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj&export=download";
    const audioFiles: Record<string, string> = {
      'B': "assets/audio/Petit Papillon/Partie bombarde [2024-01-31 233921].wav",
      'C': 'assets/audio/Petit Papillon/PetitPapillon_couplet [2024-01-20 122633].wav',
      'R': 'assets/audio/Petit Papillon/Refrain [2024-01-31 233926].wav',
    }
    const audioFile = audioFiles[this.currentPattern];
    if (!audioFile) {
      return;
    }

    const player = new Tone.Player({
      url: audioFile,
      loop: true,
      // autostart: true,
    }).toDestination();
    this.player = player;

    await Tone.loaded() // évite les erreurs de buffer

    await this.play();

  }

  async play(): Promise<void> {
    if (this.player) {
      console.log('play')
      const bView = "https://drive.google.com/file/d/1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj/view?usp=sharing";
      const bDownload = "https://drive.usercontent.google.com/u/0/uc?id=1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj&export=download";
      const b = "../assets/audio/Petit Papillon/Partie bombarde [2024-01-31 233921].wav";
      // const player = new Tone.Player({
      //   url: b,
      //   loop: true,
      //   autostart: true,
      // }).toDestination();
      // Tone.loaded().then(() => {
      //   player.start();
      // });
      await Tone.start()
      this.player.start();
    }
  }

  async stop(): Promise<void> {
    if (this.player) {
      await Tone.start()
      this.player.stop()
    }
  }
}
