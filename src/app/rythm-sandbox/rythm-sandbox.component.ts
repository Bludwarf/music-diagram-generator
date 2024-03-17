import {ChangeDetectorRef, Component} from '@angular/core';
import {RythmBarComponent} from '../rythm-bar/rythm-bar.component';
import {RythmBarEvent} from '../rythm-bar/event';
import {CommonModule, JsonPipe} from '@angular/common';
import events from '../../assets/events/Petit Papillon/events.json';
import stuctureObject from '../../assets/structures/Petit Papillon.json';
import {StructureComponent} from '../structure/structure.component';
import * as Tone from 'tone'
import {FormsModule} from '@angular/forms';
import {Transport} from 'tone/build/esm/core/clock/Transport';
import {Structure} from '../structure/structure';
import {Pattern} from '../structure/pattern/pattern';
import {Time} from '../time';
import {PatternInStructure} from '../structure/pattern/pattern-in-structure';
import {FretboardComponent} from '../fretboard/fretboard.component';
import {Chord, Key, Note} from '../notes';
import {sequence} from '../utils';

// On utilise pour l'instant le fichier DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01.wav

@Component({
  selector: 'app-rythm-sandbox',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, StructureComponent, CommonModule, FormsModule, FretboardComponent],
  templateUrl: './rythm-sandbox.component.html',
  styleUrl: './rythm-sandbox.component.scss',
})
export class RythmSandboxComponent {
  events: RythmBarEvent[] = RythmBarEvent.fromEach(events);

  currentPatternInStructure?: PatternInStructure;
  currentChord?: Chord;

  private player?: Tone.Player;

  progress = 0;
  timecode?: string;
  structure?: Structure;
  rythmBarTimecode?: string;
  currentPatternInStructureRelativeTimecode?: string;

  protected sequence = sequence

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    // console.log('Events chargés depuis le JSON', events);

    // Tone.Transport.schedule(function (time) {
    //   console.log('Première mesure')
    // }, "1m");
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

    const key = new Key(new Note(7), new Note(9))

    const bombardeSeuleIntro = Pattern.fromData({
      name: 'Début bombarde (G à 4.4)',
      initial: 'B0',
      key,
      duration: '4m',
    })
    const bombarde = Pattern.fromData({
      name: 'Partie bombarde',
      initial: 'B',
      key,
      chords: '| Gm F | Eb D | Gm F | Eb D Gm Gm |',
      events: events.filter((event: any) => event.bar >= 1 || event.bar <= 2),
    })
    const bombardeSeuleM1 = Pattern.fromData({
      name: 'Bombarde seule',
      initial: 'B*1',
      duration: '1m', // TODO on devrait pouvoir faire plutôt : chords: '|  | Eb D |'
      key,
    })
    const bombardeSeuleM2 = Pattern.fromData({
      name: 'Retour groupe',
      initial: 'B*2',
      chords: '| Eb D |',
      key,
      events: events.filter((event: any) => event.bar == 2),
    })
    const bombardeM3et4 = Pattern.fromData({
      name: '1/2 Partie bombarde',
      initial: 'B*34',
      key,
      chords: '| Gm F | Eb D Gm Gm |',
      events: events.filter((event: any) => event.bar >= 1 || event.bar <= 2),
    })
    const couplet = Pattern.fromData({
      name: 'Couplet',
      key,
      chords: '| Gm F | Eb D | Gm F | Eb D Gm Gm |',
      events: events.filter((event: any) => event.bar >= 3 || event.bar <= 4),
    })
    const coupletBb = Pattern.fromData({
      name: 'Couplet (Bb)',
      initial: 'C\'',
      key,
      chords: '| Gm F | Eb Bb | Gm F | Eb D Gm Gm |',
      events: events.filter((event: any) => event.bar >= 3 || event.bar <= 4),
    })
    const refrain = Pattern.fromData({
      name: 'Refrain',
      duration: '4m',
      key,
      chords: '| Bb | F | C | Gm |',
      events: events.filter((event: any) => event.bar >= 5),
    })

    const intro = [bombardeSeuleIntro, bombarde, bombarde]
    const bombardePassage = [bombarde, bombarde]
    const bombardePassageApresRefrain = [bombardeSeuleM1, bombardeSeuleM2, bombardeM3et4, bombarde]
    const coupletPassage = [couplet, coupletBb]
    const refrainPassage = [refrain, refrain]

    const structure = Structure.builder()
      .stuctureObject(stuctureObject)
      .patterns([
        ...intro,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...bombardePassageApresRefrain,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...bombardePassageApresRefrain,
      ])
      .getEventsStartTime((pattern: Pattern) => {
        if (pattern === bombarde) return Time.fromValue("0:0")
        if (pattern === bombardeM3et4) return Time.fromValue("0:0")
        if (pattern === bombardeSeuleM2) return Time.fromValue("1:0")
        if (pattern === couplet) return Time.fromValue("2:0")
        if (pattern === coupletBb) return Time.fromValue("2:0")
        if (pattern === refrain) return Time.fromValue("4:0")
        return undefined
      })
      .getEventsDurationInBars((pattern: Pattern) => {
        if (pattern === bombarde) return 2
        if (pattern === bombardeM3et4) return 2
        if (pattern === bombardeSeuleM2) return 1
        if (pattern === couplet) return 2
        if (pattern === coupletBb) return 2
        if (pattern === refrain) return 4
        return undefined
      })
      .build()
    // console.log(couplet.duration.toAbletonLiveBarsBeatsSixteenths())
    // console.log(new Structure(coupletBlock).duration.toAbletonLiveBarsBeatsSixteenths())
    // console.log(structure.duration.toBarsBeatsSixteenths())

    // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = structure.sampleDuration.toSeconds() // structure.duration.toBarsBeatsSixteenths();

    player.sync().start(0)

    const transportProgressLoop = new Tone.Loop((time) => {
      // console.log('t1', time)
      // console.log('t1BBS', Tone.Time(time).toBarsBeatsSixteenths())
      // console.log('P1', Tone.Transport.position)
      Tone.Draw.schedule(() => {
        this.refresh(time)
      }, time);

    }, "16n").start(0);

    this.structure = structure
  }

  refresh(time?: number): void {

    // console.log('time', time, Tone.Transport.seconds, Tone.Transport.position)

    const abletonLiveBarsBeatsSixteenths = (transport: Transport) => {
      const fields = transport.position.toString().split(':');
      const bars = +fields[0] + 1
      const beats = +fields[1] + 1
      // TODO pour être plus précis, il faudrait utiliser time, puis le convertir en relatif à transport.position
      const sixteenths = Math.floor(+fields[2]) + 1
      return `${bars}:${beats}:${sixteenths}`
    }


    this.progress = Math.min(Math.max(0, Tone.Transport.progress), 1) * 100;

    if (this.structure) {
      const warpTime = this.structure.getWarpPosition(Tone.Transport.seconds)

      // console.log('t2', time)
      // console.log('P2', Tone.Transport.position)
      // this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)
      this.timecode = warpTime?.toAbletonLiveBarsBeatsSixteenths()

      if (warpTime) {
        const changePatternFasterDelay = Time.fromValue(0) // Time.fromValue('4n') // TODO trop bizarre à l'affichage de la section courante, mais ok pour affichage partoche
        const delayedWrappedTime = warpTime.add(changePatternFasterDelay);
        this.currentPatternInStructure = this.structure.getPatternInStructureAt(delayedWrappedTime)
        this.currentChord = this.currentPatternInStructure?.getChordAt(delayedWrappedTime)

        if (this.currentPatternInStructure) {
          if (this.currentPatternInStructure.eventsStartTime) {
            this.rythmBarTimecode = delayedWrappedTime
              .relativeTo(this.currentPatternInStructure.startTime)
              .mod(this.currentPatternInStructure.eventsDurationInBars)
              .add(this.currentPatternInStructure.eventsStartTime)
              .toAbletonLiveBarsBeatsSixteenths()
          } else {
            delete this.rythmBarTimecode
          }
          this.currentPatternInStructureRelativeTimecode = delayedWrappedTime
            .relativeTo(this.currentPatternInStructure.startTime)
            .toAbletonLiveBarsBeatsSixteenths()
        } else {
          delete this.rythmBarTimecode
          delete this.currentPatternInStructureRelativeTimecode
        }
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  async playSong(): Promise<void> {
    console.log('playSong')
    await Tone.loaded() // évite les erreurs de buffer
    Tone.start()
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

  onClickPatternInStructure(patternInStructure: PatternInStructure): void {
    const wrappedTime = patternInStructure.structure.getWrappedTime(patternInStructure.startTime);
    if (wrappedTime) {
      // const progress = wrappedTime.toSeconds() / sampleDuration.toSeconds()
      const progress = wrappedTime.toSeconds() / patternInStructure.structure.sampleDuration.toSeconds();
      this.setProgressPercent(progress * 100)
      // this.changeDetectorRef.detectChanges();
    }
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
    this.setProgressPercent(progress)
  }

  setProgressPercent(progress: number): void {
    const position = new Time(Tone.Time(progress / 100 * +Tone.Transport.loopEnd.valueOf(), 's'))
    Tone.Transport.position = position.toBarsBeatsSixteenths() // TODO trouver la bonne conversion
    this.refresh()
  }

  get playing(): boolean {
    return Tone.Transport.state === 'started'
  }

}
