import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RythmBarComponent} from '../rythm-bar/rythm-bar.component';
import {RythmBarEvent} from '../rythm-bar/event';
import {CommonModule, JsonPipe} from '@angular/common';
import {StructureComponent} from '../structure/structure.component';
import * as Tone from 'tone'
import {FormsModule} from '@angular/forms';
import {Structure} from '../structure/structure';
import {Time} from '../time';
import {PatternInStructure} from '../structure/pattern/pattern-in-structure';
import {FretboardComponent} from '../fretboard/fretboard.component';
import {Chord} from '../notes';
import {error, sequence} from '../utils';
import petitPapillonEntry from "./entries/Petit Papillon";
import laFemmeDragonEntry from "./entries/La femme dragon";
import surcoufEntry from "./entries/Surcouf";
import leJourEntry from "./entries/Le jour (le phare)";
import resEntry from "./entries/Le résistant";
import noyerEntry from "./entries/Souffrance";
import nuagesEntry from "./entries/Nuages blancs";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {SongEntry} from "./song-entry";

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [RythmBarComponent, JsonPipe, StructureComponent, CommonModule, FormsModule, FretboardComponent],
  templateUrl: './song.component.html',
  styleUrl: './song.component.scss',
})
export class SongComponent implements OnInit {

  currentPatternInStructure?: PatternInStructure;
  currentChord?: Chord;

  private player?: Tone.Player;

  progress = 0;
  timecode?: string;
  structure?: Structure;
  rythmBarTimecode?: string;
  currentPatternInStructureRelativeTimecode?: string;

  songEntries: SongEntry[] = []

  protected sequence = sequence

  sampleIsLoaded = false

  songName?: string

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
  ) {
    this.songEntries.push(petitPapillonEntry)
    this.songEntries.push(laFemmeDragonEntry)
    this.songEntries.push(surcoufEntry)
    this.songEntries.push(leJourEntry)
    this.songEntries.push(resEntry)
    this.songEntries.push(noyerEntry)
    this.songEntries.push(nuagesEntry)

    // TODO unsubscribe
    activatedRoute.params.subscribe(params => {
      this.songName = params['songName']
      if (this.songName) {
        title.setTitle(this.songName)
      } else {
        error('Aucun titre')
      }
    })

    // console.log('Events chargés depuis le JSON', events);

    // Tone.Transport.schedule(function (time) {
    //   console.log('Première mesure')
    // }, "1m");
  }

  ngOnInit() {
    const entry = this.songEntries.find(entry => this.songNameEquals(entry.name));
    if (!entry) {
      error('SongEntry inconnu pour ' + this.songName)
    }
    this.structure = entry.structure
  }

  private songNameEquals(songName: string) {
    if (!this.songName) {
      return false
    }
    const format = (string: string) => string.toLowerCase().trim()
    return format(songName) === format(this.songName);
  }

  addEvent(event: RythmBarEvent): void {
    // this.events.push(event);
    // this.logEvents();
    // this.changeDetectorRef.detectChanges() // TODO nécessaire (depuis l'ajout de Tone il semblerait)
  }

  removeEvent(event: RythmBarEvent): void {
    // this.events.splice(this.events.indexOf(event), 1);
    // this.logEvents();
    // this.changeDetectorRef.detectChanges() // TODO nécessaire (depuis l'ajout de Tone il semblerait)
  }

  async uploadFile(event: Event): Promise<void> {
    if (!this.structure) {
      error('Aucune structure')
    }

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
      // loopStart: 0,
      // loopEnd: this.structure.sampleDuration.toSeconds(),
    }).toDestination();

    await Tone.loaded() // évite les erreurs de buffer

    // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = this.structure.sampleDuration.toSeconds() // structure.duration.toBarsBeatsSixteenths();

    player.sync().start(0)

    const transportProgressLoop = new Tone.Loop((time) => {
      // console.log('t1', time)
      // console.log('t1BBS', Tone.Time(time).toBarsBeatsSixteenths())
      // console.log('P1', Tone.Transport.position)
      Tone.Draw.schedule(() => {
        this.refresh(time)
      }, time);

    }, "16n").start(0);

    this.sampleIsLoaded = true

  }

  refresh(time?: number): void {

    // console.log('time', time, Tone.Transport.seconds, Tone.Transport.position)

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
