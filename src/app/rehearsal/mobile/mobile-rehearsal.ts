import {ChangeDetectorRef} from '@angular/core';
import {SectionInStructure} from "../../structure/section/section-in-structure";
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {BarNumber0Indexed, Chord, Key} from "../../notes";
import {Structure} from "../../structure/structure";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {RythmBarEvent} from "../../rythm-bar/event";
import * as Tone from "tone";
import {Time, TimedElement} from "../../time";
import {error, sequence, stripExtension} from '../../utils';
import {Recording} from "../../recording/recording";
import {PartInStructure} from "../../structure/part/part-in-structure";
import {SampleCacheService} from '../../sample/samples-cache.service';
import {SongRepository} from '../../song/song-repository';

export abstract class MobileRehearsal {

  debug = false

  currentPartInStructure?: PartInStructure;
  currentSectionInStructure?: SectionInStructure;
  currentPatternInStructure?: PatternInStructure;
  currentChord?: Chord;
  currentKey?: Key;

  progress = 0;
  timecode?: string;
  currentBar?: BarNumber0Indexed;
  transportPosition?: any;
  transportSeconds?: number
  structure?: Structure;
  recording?: Recording;
  rythmBarTimecode?: string;
  transportBeatTime?: number
  currentSectionInStructureRelativeTimecode?: string;
  currentPatternInStructureRelativeTimecode?: string;

  protected sequence = sequence

  player?: Tone.Player
  transportProgressLoop?: Tone.Loop<Tone.LoopOptions>;
  sampleIsLoaded = false

  songName?: string
  loopedElement?: TimedElement;

  protected constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
    protected readonly sampleCacheService: SampleCacheService,
    private readonly songRepository: SongRepository,
  ) {

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
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList?.length) {
      return;
    }

    const audioFile = fileList[0]
    if (audioFile) {
      const nameWithoutExtension = stripExtension(audioFile.name)
      if (nameWithoutExtension !== this.recording.name) {
        alert(`Le nom du fichier chargé "${audioFile.name}" ne correspond pas à celui de l'enregistrement "${this.recording.name}"`)
      }
      this.sampleCacheService.set(this.recording.name, audioFile)
    }

    this.playAudioFile(audioFile)
  }

  async playAudioFile(audioFile: File): Promise<void> {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }

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
    if (!this.loopedElement) {
      this.loopOnRecording()
    }

    player.sync().start(0)
    this.player = player

    this.transportProgressLoop = new Tone.Loop((time) => {
      // console.log('t1', time)
      // console.log('t1BBS', Tone.Time(time).toBarsBeatsSixteenths())
      // console.log('P1', Tone.Transport.position)
      Tone.Draw.schedule(() => {
        try {
          this.refresh(time)
        } catch (e) {
          console.error('Erreur lors du refresh', e)
        }
      }, time);

    }, "16n").start(0);

    await Tone.loaded() // évite les erreurs de buffer
    await Tone.start()

    this.sampleIsLoaded = true

    await this.playSong();
  }

  loopOnRecording(): void {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }
    Tone.Transport.loop = true
    Tone.Transport.loopStart = 0
    Tone.Transport.loopEnd = this.recording.sampleDuration.toSeconds() // structure.duration.toBarsBeatsSixteenths()
    delete this.loopedElement
  }

  refresh(time?: number): void {

    // console.log('time', time, Tone.Transport.seconds, Tone.Transport.position)

    this.progress = Math.min(Math.max(0, Tone.Transport.progress), 1) * 100;

    if (this.structure && this.recording) {
      this.transportSeconds = +Tone.Transport.seconds.toFixed(3)
      const warpTime = this.recording.getWarpPosition(Tone.Transport.seconds)

      if (warpTime) {

        // console.log('t2', time)
        // console.log('P2', Tone.Transport.position)
        // this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)
        this.transportPosition = Tone.Transport.position
        this.timecode = warpTime.toAbletonLiveBarsBeatsSixteenths()
        this.currentBar = warpTime.toBars() // TODO faire un utilitaire qui détecte la mesure en fonction d'une structure et de changements de signature
        this.transportBeatTime = +warpTime.toBeatTime()

        const changePatternFasterDelay = Time.fromValue(0) // Time.fromValue('4n') // TODO trop bizarre à l'affichage de la section courante, mais ok pour affichage partoche
        const delayedWrappedTime = warpTime.add(changePatternFasterDelay);

        this.currentPartInStructure = this.structure.getPartInStructureAt(delayedWrappedTime)
        if (this.currentPartInStructure) {
          this.currentSectionInStructure = this.currentPartInStructure.getSectionInStructureAt(delayedWrappedTime)
        } else {
          delete this.currentSectionInStructure
        }

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
        this.currentKey = this.currentPatternInStructure?.getKeyAt(delayedWrappedTime)

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

  onClickElementInStructure(element: TimedElement): void {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }

    // TODO gérer la boucle sur une mesure (quand on vient de onClickBar)
    const isCurrentInStructure = this.isCurrentInStructure(element);
    let elementToLoop: TimedElement | undefined;
    if (isCurrentInStructure) {
      elementToLoop = element === this.loopedElement ? undefined : element
    } else {
      elementToLoop = undefined
    }
    elementToLoop ? this.loopOn(elementToLoop) : this.loopOnRecording();

    if (!isCurrentInStructure) {
      const wrappedTime = this.recording.getWrappedTime(element.startTime);
      if (wrappedTime) {
        const fixOffset = 0.05 // On corrige la sélection qui arrive souvent sur l'élément précédent
        Tone.Transport.seconds = wrappedTime.toSeconds() + fixOffset
        this.refresh()
      }
    }
  }

  isCurrentInStructure(element: any): boolean {
    return element && (element === this.currentPartInStructure ||  element === this.currentSectionInStructure || element === this.currentPatternInStructure)
  }

  private loopOn(element: TimedElement) {
    let looped = false

    if (this.loopedElement !== element) {
      if (!this.recording) {
        error('Aucun enregistrement (Recording)')
      }

      const wrappedStartTime = this.recording.getWrappedTime(element.startTime)
      if (wrappedStartTime !== undefined) {
        const wrappedEndTime = this.recording.getWrappedTime(element.endTime)
        if (wrappedEndTime !== undefined) {
          Tone.Transport.loop = true
          Tone.Transport.loopStart = wrappedStartTime.toSeconds()
          Tone.Transport.loopEnd = wrappedEndTime.toSeconds()
          looped = true
        }
      }
    }

    Tone.Transport.loop = looped
    if (looped) {
      this.loopedElement = element
    } else {
      this.loopOnRecording()
    }
  }

  onClickBar(bar: BarNumber0Indexed): void {
    let startTime = Time.fromBar(bar)
    this.onClickElementInStructure({
      startTime, // TODO faire un élément BarInStructure ?
      endTime: startTime.add(Time.fromBar(1)),
    })
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

  protected requireSongEntry() {
    return this.songRepository.requireSongEntry(this.songName)
  }

  destroy(): void {
    if (this.transportProgressLoop) {
      this.transportProgressLoop.cancel()
      this.transportProgressLoop.dispose()
      delete this.transportProgressLoop
    }
    if (this.player) {
      this.player.unsync()
      this.player.dispose()
      delete this.player
    }
    this.stopSong()
  }
}
