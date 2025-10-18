import {ChangeDetectorRef} from '@angular/core';
import {SectionInStructure} from "../../structure/section/section-in-structure";
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {BarNumber0Indexed, Chord, Chords, Key} from "../../notes";
import {Structure} from "../../structure/structure";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {RythmBarEvent} from "../../rythm-bar/event";
import * as Tone from "tone";
import {Position, PositionedElement, PositionFormatter, SecTime} from "../../time";
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
  position?: Position;
  transportPosition?: any;
  transportSeconds?: number
  structure?: Structure;
  recording?: Recording;
  rythmBarTimecode?: string;
  transportBeatTime?: number

  protected sequence = sequence

  player?: Tone.Player
  transportProgressLoop?: Tone.Loop<Tone.LoopOptions>;
  sampleIsLoaded = false

  songName?: string
  loopedElement?: PositionedElement;

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
        alert(`Le nom du fichier chargé "${audioFile.name}" ("${nameWithoutExtension}" sans extension) ne correspond pas à celui de l'enregistrement "${this.recording.name}"`)
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
      const transportTime = Tone.Transport.seconds;
      Tone.Draw.schedule(() => {
        try {
          const drawTime = Tone.Transport.seconds;
          this.refresh(transportTime, drawTime)
        } catch (e) {
          console.error('Erreur lors du refresh', e)
        }
      }, time);

    }, "32n").start(0);

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
    Tone.Transport.loopEnd = this.recording.sampleDurationInSeconds // structure.duration.toBarsBeatsSixteenths()
    delete this.loopedElement
  }

  protected resetStates(selectedPosition?: Position) {
    // Si besoin, dans les composants enfants
  }

  refresh(transportTime?: number, drawTime?: number, position?: Position): void {
    if (drawTime !== undefined && transportTime !== undefined) {
      const delta = drawTime - transportTime;
      if (delta < 0) {
        // Peut se produire lors que ToneJs a fait une boucle, mais que l'affichage (le refresh) est en retard
        console.warn(`Détection d'un delta négatif => on ignore le refresh`, delta)
        return;
      }
    }

    // TODO pour optimiser drastiquement les perfs, on pourrait faire des refresh spécifique en fonction des besoins (pour limiter le nombre de refresh)

    // console.log('time', time, Tone.Transport.seconds, Tone.Transport.position)

    this.progress = Math.min(Math.max(0, Tone.Transport.progress), 1) * 100;

    if (this.structure && this.recording) {
      this.transportSeconds = +Tone.Transport.seconds.toFixed(3)
      const secTime = SecTime.fromToneTransportSeconds(transportTime ?? Tone.Transport.seconds);
      const beatTime = this.recording.getBeatTime(secTime);

      if (beatTime && beatTime.value > 0) {
        position ??= this.recording.getPosition(beatTime);
        this.position = position;

        // console.log('t2', time)
        // console.log('P2', Tone.Transport.position)
        // this.timecode = abletonLiveBarsBeatsSixteenths(Tone.Transport)
        this.transportPosition = Tone.Transport.position
        this.timecode = PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position);
        const previousCurrentBar = this.currentBar;
        this.currentBar = position.bars
        this.transportBeatTime = beatTime.value

        this.currentPartInStructure = this.structure.getPartInStructureAt(position)
        this.currentSectionInStructure = this.currentPartInStructure.getSectionInStructureAt(position)

        // if (this.currentSectionInStructure) {
        //   this.currentPatternInStructure = this.currentSectionInStructure.getPatternInStructureAt(position)
        // } else {
        //   delete this.currentPatternInStructure
        // }
        const previousCurrentChord = this.currentChord;
        this.currentChord = this.currentPatternInStructure?.getChordAt(position)
        if (this.currentBar !== previousCurrentBar || this.currentChord !== previousCurrentChord) {
          this.onBarChange(this.currentBar, this.currentChord);
        }
        this.currentKey = this.currentPatternInStructure?.getKeyAt(position)

        if (this.currentPatternInStructure) {
          if (this.currentPatternInStructure.eventsStartPosition) {
            this.rythmBarTimecode = PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position
              .relativeTo(this.currentPatternInStructure.startPosition)
              .modBars(this.currentPatternInStructure.eventsDurationInBars)
              .addBars(this.currentPatternInStructure.eventsStartPosition.bars));
          } else {
            delete this.rythmBarTimecode
          }
        } else {
          delete this.rythmBarTimecode
        }
      } else {
        delete this.timecode
        delete this.rythmBarTimecode
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  async playSong(): Promise<void> {
    console.log('playSong')
    Tone.Transport.start('+0.1') // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
  }

  async pauseSong(): Promise<void> {
    console.log('pauseSong')
    Tone.Transport.pause()
  }

  stopSong(): void {
    console.log('stopSong')
    Tone.Transport.stop()
  }

  onClickElementInStructure(element: PositionedElement, isCurrentInStructure = this.isCurrentInStructure(element)): void {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }

    let elementToLoop: PositionedElement | undefined;
    if (isCurrentInStructure) {
      elementToLoop = element === this.loopedElement ? undefined : element
    } else {
      elementToLoop = undefined
    }
    elementToLoop ? this.loopOn(elementToLoop) : this.loopOnRecording();

    if (!isCurrentInStructure) {
      this.setPosition(element.startPosition);
      if (element instanceof PatternInStructure) {
        console.log('click => set', element.pattern.name)
        this.currentPatternInStructure = element
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  setPosition(position: Position) {
    const secTime = this.recording?.getSecTimeAt(position);
    if (secTime !== undefined) {
      const fixOffset = 0.05 // On corrige la sélection qui arrive souvent sur l'élément précédent => TODO corriger en arrondissant la sélection dans le refresh
      Tone.Transport.seconds = secTime.value + fixOffset
      this.resetStates(position);
      this.refresh(undefined, undefined, position)
    }
  }

  isCurrentInStructure(element: any): boolean {
    return element && (element === this.currentPartInStructure || element === this.currentSectionInStructure || element === this.currentPatternInStructure)
  }

  private loopOn(element: PositionedElement) {
    let looped = false

    if (this.loopedElement !== element) {
      if (!this.recording) {
        error('Aucun enregistrement (Recording)')
      }

      const wrappedStartTime = this.recording.getSecTimeAt(element.startPosition);
      if (wrappedStartTime !== undefined) {
        const wrappedEndTime = this.recording.getSecTimeAt(element.endPosition);
        if (wrappedEndTime !== undefined) {
          Tone.Transport.loop = true
          Tone.Transport.loopStart = wrappedStartTime.value
          Tone.Transport.loopEnd = wrappedEndTime.value
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
    const barAsPositionedElement = this.getBarAsPositionedElement(bar);
    this.onClickElementInStructure(barAsPositionedElement, bar === this.currentBar)
  }

  getBarAsPositionedElement(bar: BarNumber0Indexed): PositionedElement {
    const startPosition = new Position(bar)
    const endPosition = startPosition.addBars(1);
    return {
      startPosition,
      endPosition,
    }
  }

  get currentBarAsPositionedElement(): PositionedElement | undefined {
    return this.currentBar !== undefined ? this.getBarAsPositionedElement(this.currentBar) : undefined
  }

  setProgress(event: Event): void {
    const rangeInput = event.target as HTMLInputElement
    const progress = +rangeInput.value
    this.setProgressPercent(progress)
  }

  setProgressPercent(progress: number): void {
    const loopEndInSeconds = Tone.Time(Tone.Transport.loopEnd).toSeconds();
    Tone.Transport.position = progress / 100 * loopEndInSeconds
    this.resetStates();
    this.refresh()
  }

  get playing(): boolean {
    return Tone.Transport.state === 'started'
  }

  protected requireSongEntry() {
    return this.songRepository.requireSongEntry(this.songName!!)
  }

  getPatternChords(patternInStructure: PatternInStructure): Chords {
    return patternInStructure.pattern.chords || Chords.repeatNoChord(patternInStructure.pattern.durationInBars);
  }

  onBarChange(currentBar: BarNumber0Indexed, currentChord: Chord | undefined) {
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

export type ViewType = 'A' | 'B' | 'B-maq' | 'P' | 'P-osmd'
export const VIEW_TYPES: ViewType[] = ['A', 'B', 'B-maq', 'P', 'P-osmd']
