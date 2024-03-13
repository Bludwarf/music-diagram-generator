import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { RythmBarComponent } from '../rythm-bar/rythm-bar.component';
import { IRythmBarEvent, RythmBarEvent } from '../rythm-bar/event';
import { CommonModule, JsonPipe } from '@angular/common';
import events from '../../assets/events/Petit Papillon/events.json';
import { StructureComponent } from '../structure/structure.component';
import * as Tone from 'tone'
import { FormsModule } from '@angular/forms';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { Structure } from '../structure/structure';
import { Pattern } from '../structure/pattern/pattern';
import { Time } from '../time';

@Component({
  selector: 'app-rythm-sandbox',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, StructureComponent, CommonModule, FormsModule],
  templateUrl: './rythm-sandbox.component.html',
  styleUrl: './rythm-sandbox.component.scss',
})
export class RythmSandboxComponent {
  events: RythmBarEvent[] = RythmBarEvent.fromEach(events);

  currentPattern?: Pattern;

  private player?: Tone.Player;

  patternToPlay?: string;
  progress = 0;
  timecode?: string;
  structure?: Structure;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    console.log('Events chargés depuis le JSON', events);

    Tone.Transport.schedule(function (time) {
      console.log('Première mesure')
    }, "1m");
  }

  addEvent(event: RythmBarEvent): void {
    this.events.push(event);
    this.logEvents();
    this.changeDetectorRef.detectChanges() // TODO nécessaire (depuis l'ajout de Tone il semblerait)
  }

  removeEvent(event: RythmBarEvent): void {
    this.events.splice(this.events.indexOf(event), 1);
    this.logEvents();
    this.changeDetectorRef.detectChanges() // TODO nécessaire (depuis l'ajout de Tone il semblerait)
  }

  logEvents(): void {
    // console.table(this.events)
    console.log(this.events);
  }

  async uploadFile(event: Event): Promise<void> {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList?.length) {
      return;
    }

    const audioFile = fileList[0]
    console.log("audioFile", audioFile);

    const audioFileURL = URL.createObjectURL(audioFile);

    const player = new Tone.Player({
      url: audioFileURL,
      // loop: true,
      // autostart: true,
    }).toDestination();

    await Tone.loaded() // évite les erreurs de buffer

    const couplet = new Pattern('Couplet', new Time(Tone.Time('2m')))
    const bombarde = new Pattern('Partie bombarde', new Time(Tone.Time('2m')))
    const refrain = new Pattern('Refrain', new Time(Tone.Time('4m')))

    const coupletBlock = [couplet, couplet]
    const bombardeBlock = [bombarde, bombarde]
    const refrainBlock = [refrain]

    const coupletPassage = [...coupletBlock, ...coupletBlock]
    const bombardePassage = [...bombardeBlock, ...bombardeBlock]
    const refrainPassage = [...refrainBlock, ...refrainBlock]

    const structure = new Structure(
      [
        ...bombardeBlock, ...bombardeBlock, ...bombardeBlock,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...coupletPassage,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...coupletPassage,
      ]
    )
    console.log(couplet.duration.toAbletonLiveBarsBeatsSixteenths())
    console.log(new Structure(coupletBlock).duration.toAbletonLiveBarsBeatsSixteenths())
    console.log(structure.duration.toBarsBeatsSixteenths())

    // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = "0:0";
    Tone.Transport.loopEnd = structure.duration.toBarsBeatsSixteenths();

    player.sync().start("1:0")

    const transportProgressLoop = new Tone.Loop((time) => {
      // console.log('t1', time)
      // console.log('t1BBS', Tone.Time(time).toBarsBeatsSixteenths())
      // console.log('P1', Tone.Transport.position)
      Tone.Draw.schedule(() => {
        this.refresh()
      }, time);

    }, "16n").start(0);


    console.log(player)

    this.structure = structure

  }

  refresh(): void {

    const abletonLiveBarsBeatsSixteenths = (transport: Transport) => {
      const fields = transport.position.toString().split(':');
      const bars = +fields[0] + 1
      const beats = +fields[1] + 1
      // TODO pour être plus précis, il faudrait utiliser time, puis le convertir en relatif à transport.position
      const sixteenths = Math.floor(+fields[2]) + 1
      return `${bars}:${beats}:${sixteenths}`
    }

    this.progress = Math.min(Math.max(0, Tone.Transport.progress), 1) * 100;

    // console.log('t2', time)
    // console.log('P2', Tone.Transport.position)
    this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)

    // TODO classe pour décomposer chaque champ
    if (this.structure) {
      const currentPatternInStructure = this.structure.getPatternInStructureAt(Time.fromTransport(Tone.Transport));
      this.currentPattern = currentPatternInStructure?.pattern
    }

    this.changeDetectorRef.detectChanges();
  }

  async playSong(): Promise<void> {
    console.log('playSong')
    await Tone.loaded() // évite les erreurs de buffer
    Tone.Transport.start()
  }

  async pauseSong(): Promise<void> {
    console.log('pauseSong')
    await Tone.loaded() // évite les erreurs de buffer
    Tone.Transport.pause()
  }

  stopSong(): void {
    console.log('stopSong')
    Tone.Transport.stop()
  }

  onClickPattern(pattern: string): void {
    // this.currentPattern = pattern;
  }

  async loopPattern(pattern: string): Promise<void> {
    // this.currentPattern = pattern;

    // await this.stop();

    const getAudioFileURL = (pattern: string) => {
      const patternIndex = ['C', 'B', 'R'].indexOf(pattern);
      if (patternIndex === -1) {
        return undefined;
      }

      const inputElement = document.getElementsByTagName('input');
      const file = inputElement?.[patternIndex].files?.[0]
      if (!file) {
        return undefined;
      }

      console.log('file', file)
      return URL.createObjectURL(file);
    };

    // const bView = "https://drive.google.com/file/d/1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj/view?usp=sharing";
    // const bDownload = "https://drive.usercontent.google.com/u/0/uc?id=1DktZf_rGRaoRxoJEbo3NVWd9yYFX39aj&export=download";
    // const audioFiles: Record<string, string> = {
    //   'B': "assets/audio/Petit Papillon/Partie bombarde [2024-01-31 233921].wav",
    //   'C': 'assets/audio/Petit Papillon/PetitPapillon_couplet [2024-01-20 122633].wav',
    //   'R': 'assets/audio/Petit Papillon/Refrain [2024-01-31 233926].wav',
    // }
    // const audioFile = audioFiles[this.currentPattern];

    // const audioFile = getAudioFileURL(this.currentPattern);
    // if (!audioFile) {
    //   delete this.patternToPlay
    //   return
    // } else {
    //   this.patternToPlay = this.currentPattern;
    // }

    // const player = new Tone.Player({
    //   url: audioFile,
    //   loop: true,
    //   // autostart: true,
    // }).toDestination();
    // this.player = player;

    // await Tone.loaded() // évite les erreurs de buffer

    // await this.play();

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
    this.refresh() // TODO KO
  }

  setProgress(event: Event): void {
    const rangeInput = event.target as HTMLInputElement
    const progress = +rangeInput.value
    const position = new Time(Tone.Time(progress / 100 * +Tone.Transport.loopEnd.valueOf(), 's'))
    Tone.Transport.position = position.toBarsBeatsSixteenths() // TODO trouver la bonne conversion
    this.refresh()
  }
}
