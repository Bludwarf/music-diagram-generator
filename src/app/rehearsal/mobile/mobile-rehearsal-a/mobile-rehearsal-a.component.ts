import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SectionInStructure} from "../../../structure/section/section-in-structure";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {Chord} from "../../../notes";
import {Structure} from "../../../structure/structure";
import {SongEntry} from "../../../song/song-entry";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import petitPapillonEntry from "../../../song/entries/Petit Papillon";
import laFemmeDragonEntry from "../../../song/entries/La femme dragon";
import surcoufEntry from "../../../song/entries/Surcouf";
import leJourEntry from "../../../song/entries/Le jour (le phare)";
import resEntry from "../../../song/entries/Le résistant";
import noyerEntry from "../../../song/entries/Souffrance";
import nuagesEntry from "../../../song/entries/Nuages blancs";
import {RythmBarEvent} from "../../../rythm-bar/event";
import * as Tone from "tone";
import {Time, TimedElement} from "../../../time";
import {error, sequence} from '../../../utils';
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {CommonModule, JsonPipe} from "@angular/common";
import {StructureComponent} from "../../../structure/structure.component";
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {PatternComponent} from "../../../structure/pattern/pattern.component";
import {SectionComponent} from "../../../structure/section/section.component";

@Component({
  selector: 'app-mobile-rehearsal-a',
  standalone: true,
  imports: [
    RythmBarComponent, JsonPipe, StructureComponent, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent
  ],
  templateUrl: './mobile-rehearsal-a.component.html',
  styleUrl: './mobile-rehearsal-a.component.scss'
})
export class MobileRehearsalAComponent implements OnInit {

  debug = false

  currentSectionInStructure?: SectionInStructure;
  currentPatternInStructure?: PatternInStructure;
  currentChord?: Chord;

  progress = 0;
  timecode?: string;
  transportPosition?: any;
  transportSeconds?: number
  structure?: Structure;
  rythmBarTimecode?: string;
  transportBeatTime?: number
  currentSectionInStructureRelativeTimecode?: string;
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

    await Tone.loaded() // évite les erreurs de buffer
    await Tone.start()

    this.sampleIsLoaded = true

  }

  refresh(time?: number): void {

    // console.log('time', time, Tone.Transport.seconds, Tone.Transport.position)

    this.progress = Math.min(Math.max(0, Tone.Transport.progress), 1) * 100;

    if (this.structure) {
      this.transportSeconds = +Tone.Transport.seconds.toFixed(3)
      const warpTime = this.structure.getWarpPosition(Tone.Transport.seconds)

      if (warpTime) {

        // console.log('t2', time)
        // console.log('P2', Tone.Transport.position)
        // this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)
        this.transportPosition = Tone.Transport.position
        this.timecode = warpTime.toAbletonLiveBarsBeatsSixteenths()
        this.transportBeatTime = +warpTime.toBeatTime().toFixed(0)

        const changePatternFasterDelay = Time.fromValue(0) // Time.fromValue('4n') // TODO trop bizarre à l'affichage de la section courante, mais ok pour affichage partoche
        const delayedWrappedTime = warpTime.add(changePatternFasterDelay);
        this.currentSectionInStructure = this.structure.getSectionInStructureAt(delayedWrappedTime)
        if (this.currentSectionInStructure) {
          this.currentPatternInStructure = this.currentSectionInStructure.getPatternInStructureAt(delayedWrappedTime)
          this.currentSectionInStructureRelativeTimecode = delayedWrappedTime
            .relativeTo(this.currentSectionInStructure.startTime)
            .toAbletonLiveBarsBeatsSixteenths()
        } else {
          delete this.currentPatternInStructure
          delete this.currentSectionInStructureRelativeTimecode
        }
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
      } else {
        delete this.timecode
        delete this.rythmBarTimecode
        delete this.currentPatternInStructureRelativeTimecode
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  async playSong(): Promise<void> {
    console.log('playSong')
    Tone.Transport.start()
  }

  async pauseSong(): Promise<void> {
    console.log('pauseSong')
    Tone.Transport.pause()
  }

  stopSong(): void {
    console.log('stopSong')
    Tone.Transport.stop()
  }

  onClickSectionInStructure(sectionInStructure: SectionInStructure): void {
    this.onClickElementInStructure(sectionInStructure, sectionInStructure.structure)
  }

  onClickPatternInStructure(patternInStructure: PatternInStructure): void {
    this.onClickElementInStructure(patternInStructure, patternInStructure.structure)
  }

  private onClickElementInStructure(element: TimedElement, structure: Structure): void {
    const wrappedTime = structure.getWrappedTime(element.startTime);
    if (wrappedTime) {
      const fixOffset = 0.05 // On corrige la sélection qui arrive souvent sur l'élément précédent
      Tone.Transport.seconds = wrappedTime.toSeconds() + fixOffset
      this.refresh()
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

  setProgress(event: Event): void {
    const rangeInput = event.target as HTMLInputElement
    const progress = +rangeInput.value
    this.setProgressPercent(progress)
  }

  setProgressPercent(progress: number): void {
    Tone.Transport.position = progress / 100 * Time.fromValue(Tone.Transport.loopEnd).toSeconds()
    this.refresh()
  }

  get playing(): boolean {
    return Tone.Transport.state === 'started'
  }

}
