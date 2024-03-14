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
import { WrapMarker } from '../wrap-marker';
import { PatternInStructure } from '../structure/pattern/pattern-in-structure';
import { FretboardComponent } from '../fretboard/fretboard.component';
import { Chord, Key, Note } from '../notes';
import { sequence } from '../utils';

// TODO comment avoir la durée en secondes du sample ?
// On utilise pour l'instant le fichier DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01.wav
const sampleDuration = new Time(Tone.Time(3 * 60 + 28, 's'))

const wrapMarkers = [
  new WrapMarker(0, -1.1762159715284715),
  new WrapMarker(0.647458333333333358, 0),
  new WrapMarker(2.5494791666666665, 4),
  new WrapMarker(4.5332291666666666, 8),
  new WrapMarker(6.4147291666666666, 12),
  new WrapMarker(8.4474583333333335, 16),
  new WrapMarker(8.6234166666666656, 16.323610764235763),
  new WrapMarker(10.798354166666666, 20.323610764235763),
  new WrapMarker(12.963208333333332, 24.323610764235763),
  new WrapMarker(15.102354166666666, 28.323610764235763),
  new WrapMarker(19.361729166666667, 36.323610764235767),
  new WrapMarker(21.501687499999999, 40.323610764235767),
  new WrapMarker(23.657645833333333, 44.323610764235767),
  new WrapMarker(25.795999999999999, 48.323610764235767),
  new WrapMarker(30.123145833333332, 56.323610764235767),
  new WrapMarker(32.308437499999997, 60.323610764235767),
  new WrapMarker(36.767270833333335, 68.323610764235767),
  new WrapMarker(38.932333333333332, 72.323610764235767),
  new WrapMarker(41.07664583333333, 76.323610764235767),
  new WrapMarker(45.413229166666667, 84.323610764235767),
  new WrapMarker(47.565520833333331, 88.323610764235767),
  new WrapMarker(49.753708333333329, 92.323610764235767),
  new WrapMarker(54.171624999999999, 100.32361076423577),
  new WrapMarker(56.368416666666661, 104.32361076423577),
  new WrapMarker(58.552124999999997, 108.32361076423577),
  new WrapMarker(60.758874999999996, 112.32361076423577),
  new WrapMarker(62.942520833333333, 116.32361076423577),
  new WrapMarker(65.113833333333332, 120.32361076423577),
  new WrapMarker(69.380499999999998, 128.32361076423575),
  new WrapMarker(71.577979166666665, 132.32361076423575),
  new WrapMarker(73.796791666666664, 136.32361076423575),
  new WrapMarker(76.005020833333333, 140.32361076423575),
  new WrapMarker(78.200583333333327, 144.32361076423575),
  new WrapMarker(80.448145833333328, 148.32361076423575),
  new WrapMarker(82.717229166666669, 152.32361076423575),
  new WrapMarker(84.971625000000003, 156.32361076423575),
  new WrapMarker(89.405520833333327, 164.32361076423575),
  new WrapMarker(91.63077083333333, 168.32361076423575),
  new WrapMarker(96.124416666666662, 176.32361076423575),
  new WrapMarker(98.34041666666667, 180.32361076423575),
  new WrapMarker(100.53739583333333, 184.32361076423575),
  new WrapMarker(102.71122916666667, 188.32361076423575),
  new WrapMarker(104.86987499999999, 192.32361076423575),
  new WrapMarker(107.0630625, 196.32361076423575),
  new WrapMarker(111.51870833333334, 204.32361076423575),
  new WrapMarker(115.91847916666666, 212.32361076423575),
  new WrapMarker(118.13981249999999, 216.32361076423575),
  new WrapMarker(120.3725625, 220.32361076423575),
  new WrapMarker(122.5775625, 224.32361076423575),
  new WrapMarker(124.79789583333333, 228.32361076423575),
  new WrapMarker(129.27608333333333, 236.32361076423575),
  new WrapMarker(135.8514375, 248.32361076423575),
  new WrapMarker(138.0909375, 252.32361076423575),
  new WrapMarker(140.30443750000001, 256.32361076423575),
  new WrapMarker(144.69927083333332, 264.32361076423575),
  new WrapMarker(146.91591666666667, 268.32361076423575),
  new WrapMarker(149.09029166666667, 272.32361076423575),
  new WrapMarker(151.29185416666667, 276.32361076423575),
  new WrapMarker(155.75666666666666, 284.32361076423575),
  new WrapMarker(164.63647916666667, 300.32361076423575),
  new WrapMarker(169.04481250000001, 308.32361076423575),
  new WrapMarker(171.278875, 312.32361076423575),
  new WrapMarker(173.54152083333332, 316.32361076423575),
  new WrapMarker(175.77772916666666, 320.32361076423575),
  new WrapMarker(177.99827083333332, 324.32361076423575),
  new WrapMarker(182.51258333333334, 332.32361076423575),
  new WrapMarker(184.74072916666665, 336.32361076423575),
  new WrapMarker(186.95395833333333, 340.32361076423575),
  new WrapMarker(189.15308333333331, 344.32361076423575),
  new WrapMarker(191.31456249999999, 348.32361076423575),
  new WrapMarker(193.45008333333334, 352.32361076423575),
  new WrapMarker(195.61702083333333, 356.32361076423575),
  new WrapMarker(197.82550000000001, 360.32361076423575),
  new WrapMarker(197.84312565104167, 360.35486076423575),
  // TODO pour trouver le WrappedTime après le dernier WrapMarker, il faut calculer le tempo à la fin et interpoler
  // TODO Pour l'instant on le déduit à la louche
  // TODO que se passe-t-il si le sample continue alors que la structure est finie ?
  new WrapMarker(208, 380),
]

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

    const structure = new Structure(
      [
        ...intro,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...bombardePassageApresRefrain,
        ...coupletPassage, ...bombardePassage, ...coupletPassage, ...refrainPassage, ...bombardePassageApresRefrain,
      ],
      (pattern: Pattern) => {
        if (pattern === bombarde) return Time.fromValue("0:0")
        if (pattern === bombardeM3et4) return Time.fromValue("0:0")
        if (pattern === bombardeSeuleM2) return Time.fromValue("1:0")
        if (pattern === couplet) return Time.fromValue("2:0")
        if (pattern === coupletBb) return Time.fromValue("2:0")
        if (pattern === refrain) return Time.fromValue("4:0")
        return undefined
      },
      (pattern: Pattern) => {
        if (pattern === bombarde) return 2
        if (pattern === bombardeM3et4) return 2
        if (pattern === bombardeSeuleM2) return 1
        if (pattern === couplet) return 2
        if (pattern === coupletBb) return 2
        if (pattern === refrain) return 4
        return undefined
      },
    )
    // console.log(couplet.duration.toAbletonLiveBarsBeatsSixteenths())
    // console.log(new Structure(coupletBlock).duration.toAbletonLiveBarsBeatsSixteenths())
    // console.log(structure.duration.toBarsBeatsSixteenths())

    this.validateWrapMarker();

    // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = sampleDuration.toSeconds() // structure.duration.toBarsBeatsSixteenths();

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

    const wrappedTime = this.getWrappedPosition(Tone.Transport.seconds)

    // console.log('t2', time)
    // console.log('P2', Tone.Transport.position)
    // this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)
    this.timecode = wrappedTime?.toAbletonLiveBarsBeatsSixteenths()

    if (this.structure && wrappedTime) {
      const changePatternFasterDelay = Time.fromValue(0) // Time.fromValue('4n') // TODO trop bizarre à l'affichage de la section courante, mais ok pour affichage partoche
      const delayedWrappedTime = wrappedTime.add(changePatternFasterDelay);
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

    this.changeDetectorRef.detectChanges();
  }

  getWrappedPosition(seconds: number): Time | undefined {

    if (seconds < wrapMarkers[0].secTime) {
      return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
    }

    if (seconds > wrapMarkers[wrapMarkers.length - 1].secTime) {
      return undefined // TODO quelle position si on est après le dernier WrapMarker ?
    }

    const nextWrapMarkerIndex = wrapMarkers.findIndex(wrapMarker => seconds < wrapMarker.secTime)

    const previousWrapMarker = wrapMarkers[nextWrapMarkerIndex - 1]
    const nextWrapMarker = wrapMarkers[nextWrapMarkerIndex]
    const secTimeRatio = (seconds - previousWrapMarker.secTime) / (nextWrapMarker.secTime - previousWrapMarker.secTime)
    const beatTime = previousWrapMarker.beatTime + secTimeRatio * (nextWrapMarker.beatTime - previousWrapMarker.beatTime)

    // TODO uniquement pour une signature 4/4
    const bars = Math.floor(beatTime / 4)
    const beats = Math.floor(beatTime) - bars * 4
    const sixteenths = beatTime % 1 * 4

    const barsBeatsSixteenth = `${bars}:${beats}:${sixteenths}`;
    // console.log('wrappedPosition', barsBeatsSixteenth, new Time(Tone.Time(barsBeatsSixteenth)).toBarsBeatsSixteenths())

    return new Time(Tone.Time(barsBeatsSixteenth))
  }

  getWrappedTime(position: Time): Time | undefined {

    const beatTime = position.toAbletonLiveBeatTime()

    if (beatTime < wrapMarkers[0].beatTime) {
      return undefined // TODO quelle position si on est avant "1:1:1" ? Impossible dans Ableton Live
    }

    if (beatTime > wrapMarkers[wrapMarkers.length - 1].beatTime) {
      return undefined // TODO quelle position si on est après le dernier WrapMarker ?
    }

    const nextWrapMarkerIndex = wrapMarkers.findIndex(wrapMarker => beatTime < wrapMarker.beatTime)

    const previousWrapMarker = wrapMarkers[nextWrapMarkerIndex - 1]
    const nextWrapMarker = wrapMarkers[nextWrapMarkerIndex]
    const beatTimeRatio = (beatTime - previousWrapMarker.beatTime) / (nextWrapMarker.beatTime - previousWrapMarker.beatTime)
    const secTime = previousWrapMarker.secTime + beatTimeRatio * (nextWrapMarker.secTime - previousWrapMarker.secTime)

    return new Time(Tone.Time(secTime))
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
    const wrappedTime = this.getWrappedTime(patternInStructure.startTime);
    if (wrappedTime) {
      // const progress = wrappedTime.toSeconds() / sampleDuration.toSeconds()
      const progress = wrappedTime.toSeconds() / sampleDuration.toSeconds();
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

  private validateWrapMarker() {
    const lastWrapMarker = wrapMarkers[wrapMarkers.length - 1];
    const sampleDurationInSeconds = sampleDuration.toSeconds();
    if (lastWrapMarker.secTime !== sampleDurationInSeconds) {
      const sampleCode = `new WrapMarker(${sampleDurationInSeconds}, "beatTime relevé dans Ableton Live à la fin du sample"),`
      error(`Pour le moment, on doit ajouter la main un dernier WrapMarker précisément à la fin du sample : ${sampleCode}`)
    }
  }
}

/**
 * Pour la version mobile, on affiche une alerte, car on n'a pas forcément accès à la console pour voir les erreurs
 */
function error(message: string): never {
  alert(message)
  throw new Error(message)
}
