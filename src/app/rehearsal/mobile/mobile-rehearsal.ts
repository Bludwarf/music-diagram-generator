import {ElementRef, signal} from '@angular/core';
import {SectionInStructure} from "../../structure/section/section-in-structure";
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {BarNumber0Indexed, Chord, Chords, Key} from "../../notes";
import {Structure} from "../../structure/structure";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {RythmBarEvent} from "../../rythm-bar/event";
import {loaded, Loop, LoopOptions, Player, start, Time as ToneTime, Transport} from "tone";
import {BeatTime, Position, PositionedElement, PositionFormatter, SecTime} from "../../time";
import {error, sequence, stripExtension} from '../../utils';
import {Recording} from "../../recording/recording";
import {PartInStructure} from "../../structure/part/part-in-structure";
import {SampleCacheService} from '../../sample/samples-cache.service';
import {SongRepository} from '../../song/song-repository';
import {BarsBeatsSixteenths, Time} from "tone/Tone/core/type/Units";
import {ToneAdapter} from "../../tonejs/tone-adapter";
import NoSleep from 'nosleep.js';

export abstract class MobileRehearsal {

  debug = false
  fileInput?: ElementRef<HTMLInputElement>;

  get currentPartInStructure(): PartInStructure | undefined {
    return this.currentSectionInStructure?.partInStructure
  }

  get currentSectionInStructure(): SectionInStructure | undefined {
    return this.currentPatternInStructure?.sectionInStructure
  }

  currentPatternInStructure?: PatternInStructure; // TODO se baser sur currentPositionedBar

  private readonly noSleep = new NoSleep();

  get currentChord(): Chord | undefined {
    const position = this.position;
    if (!position) return undefined
    return this.currentPatternInStructure?.getChordAt(position)
  }

  get currentKey(): Key | undefined {
    const position = this.position;
    if (!position) return undefined
    return this.currentPatternInStructure?.getKeyAt(position)
  }

  get progress(): number {
    return Math.min(Math.max(0, Transport.progress), 1) * 100
  }

  get timecode(): string | undefined {
    return this.position ? PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(this.position) : undefined
  }

  secTime = signal(new SecTime(0))

  get beatTime(): BeatTime | undefined {
    return this.recording?.getBeatTime(this.secTime());
  }

  get currentBar(): BarNumber0Indexed | undefined {
    return this.position?.bars
  }

  get position(): Position | undefined {
    const beatTime = this.beatTime;
    if (beatTime !== undefined && beatTime.value >= 0) {
      return this.recording?.getPosition(beatTime)
    }
    return this.currentPatternInStructure?.startPosition
  }

  get transportPosition(): BarsBeatsSixteenths | Time {
    return Transport.position
  }

  get transportSeconds(): number {
    return Transport.seconds
  }

  structure?: Structure;
  recording?: Recording;

  get rythmBarTimecode(): string | undefined {
    const position = this.position;
    if (!position) {
      return undefined;
    }

    const currentPatternInStructure = this.currentPatternInStructure;
    if (!currentPatternInStructure?.eventsStartPosition) {
      return undefined;
    }

    return PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position
      .relativeTo(currentPatternInStructure.startPosition)
      .modBars(currentPatternInStructure.eventsDurationInBars)
      .addBars(currentPatternInStructure.eventsStartPosition.bars));
  }

  get transportBeatTime(): number | undefined {
    return this.beatTime?.value
  }

  protected sequence = sequence

  player?: Player
  transportProgressLoop?: Loop<LoopOptions>;
  sampleIsLoaded = false

  songName?: string
  loopedElement?: PositionedElement;

  protected constructor(
    protected readonly toneAdapter: ToneAdapter,
    activatedRoute: ActivatedRoute,
    title: Title,
    protected readonly sampleCacheService: SampleCacheService,
    private readonly songRepository: SongRepository,
  ) {

    activatedRoute.params.subscribe(params => {
      this.songName = params['songName']
      if (this.songName) {
        title.setTitle(this.songName)
      } else {
        error('Aucun titre')
      }
    })

    // console.log('Events chargés depuis le JSON', events);

    // this.toneAdapter.schedule(function (time) {
    //   console.log('Première mesure')
    // }, "1m");
  }

  async onInit() {
    const entry = await this.requireSongEntry();
    this.structure = entry.structure
    this.recording = entry.recording
    this.scheduleAll();
  }

  protected scheduleAll(): void {
    this.schedulePositionedElements();
  }

  private schedulePositionedElements() {
    const recording = this.recording;
    if (!recording) return

    const partsInStructure = this.structure?.partsInStructure;
    if (!partsInStructure) return

    partsInStructure.forEach(partInStructure => {
      partInStructure.sectionsInStructure.forEach(sectionInStructure => {
        sectionInStructure.patternsInStructure.forEach(patternInStructure => {
          const patternStartTime = recording.getSecTimeAt(patternInStructure.startPosition);
          if (patternStartTime) {
            this.toneAdapter.schedule(() => {
              this.currentPatternInStructure = patternInStructure
            }, patternStartTime.value);
          }

          const patternEndTime = recording.getSecTimeAt(patternInStructure.endPosition);
          if (patternEndTime) {
            this.toneAdapter.schedule(() => {
              if (this.currentPatternInStructure === patternInStructure) {
                delete this.currentPatternInStructure
              }
            }, patternEndTime.value);
          }
        })
      })
    })
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
      this.sampleCacheService.setFile(this.recording.name, audioFile)
    }

    await this.playAudioFile(audioFile)
  }

  async playAudioFile(audioFile: File): Promise<void> {
    await this.playAudio(audioFile);
  }

  async playAudio(audio: Blob): Promise<void> {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }

    const audioFileURL = URL.createObjectURL(audio);

    const player = new Player({
      url: audioFileURL,
      // loop: true,
      // autostart: true,
      // loopStart: 0,
      // loopEnd: this.structure.sampleDuration.toSeconds(),
    }).toDestination();

    // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
    Transport.bpm.value = 120;
    if (!this.loopedElement && this.recording) {
      this.loopOnRecording()
    }

    player.sync().start(0)
    this.player = player

    this.transportProgressLoop = this.toneAdapter.loop(() => {
      this.secTime.set(SecTime.fromToneTransportSeconds(Transport.seconds))
    }, "32n").start(0);
    await loaded() // évite les erreurs de buffer
    await start()

    this.sampleIsLoaded = true

    await this.playSong();
  }

  loopOnRecording(): void {
    if (!this.recording) {
      error('Aucun enregistrement (Recording)')
    }
    Transport.loop = true
    Transport.loopStart = 0
    Transport.loopEnd = this.recording.sampleDurationInSeconds // structure.duration.toBarsBeatsSixteenths()
    delete this.loopedElement
  }

  protected resetStates(selectedPosition?: Position) {
    // Si besoin, dans les composants enfants
  }

  async playSong(): Promise<void> {
    if (!this.sampleIsLoaded) {
      const recording = this.recording;
      if (!recording) {
        error('Aucun enregistrement (Recording)')
      }

      await this.playOrUploadAndPlayAudio(recording.name);
    }

    console.log('playSong')
    Transport.start('+0.1') // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
    await this.noSleep.enable();
  }

    protected async playOrUploadAndPlayAudio(recordingName: string) {
        const audio = await this.sampleCacheService.get(recordingName)
        if (audio) {
            await this.playAudio(audio)
        } else {
            this.fileInput?.nativeElement.click();
        }
    }

  async pauseSong(): Promise<void> {
    console.log('pauseSong')
    Transport.pause()
    this.noSleep.disable();
  }

  stopSong(): void {
    console.log('stopSong')
    Transport.stop()
    this.noSleep.disable();
  }

  onClickElementInStructure(element: PositionedElement, isCurrentInStructure = this.isCurrentInStructure(element)): void {
    let elementToLoop: PositionedElement | undefined;
    if (isCurrentInStructure) {
      elementToLoop = element === this.loopedElement ? undefined : element
    } else {
      elementToLoop = undefined
    }
    if (this.recording) {
      elementToLoop ? this.loopOn(elementToLoop) : this.loopOnRecording();
    }

    if (!isCurrentInStructure) {
      this.setPosition(element.startPosition);
      if (element instanceof PatternInStructure) {
        this.currentPatternInStructure = element
      } else if (element instanceof SectionInStructure) {
        this.currentPatternInStructure = element.patternsInStructure[0]
      } else if (element instanceof PartInStructure) {
        this.currentPatternInStructure = element.sectionsInStructure[0].patternsInStructure[0]
      } else if (this.structure) {
        // TODO créer un type BarInStructure, pour être plus propre et plus optimisé
        const position = element.startPosition
        const currentPartInStructure = this.structure.getPartInStructureAt(position)
        const currentSectionInStructure = currentPartInStructure.getSectionInStructureAt(position)
        if (currentSectionInStructure) {
          this.currentPatternInStructure = currentSectionInStructure.getPatternInStructureAt(position)
        }
      }
    }
  }

  setPosition(position: Position) {
    const secTime = this.recording?.getSecTimeAt(position);
    if (secTime !== undefined) {
      const fixOffset = 0.05 // On corrige la sélection qui arrive souvent sur l'élément précédent => TODO corriger en arrondissant la sélection dans le refresh
      Transport.seconds = secTime.value + fixOffset
      this.secTime.set(secTime)
      this.resetStates(position);
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
          Transport.loop = true
          Transport.loopStart = wrappedStartTime.value
          Transport.loopEnd = wrappedEndTime.value
          looped = true
        }
      }
    }

    Transport.loop = looped
    if (looped) {
      this.loopedElement = element
    } else if (this.recording) {
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
    const loopEndInSeconds = ToneTime(Transport.loopEnd).toSeconds();
    Transport.position = progress / 100 * loopEndInSeconds
    this.resetStates();
  }

  get playing(): boolean {
    return Transport.state === 'started'
  }

  protected async requireSongEntry() {
    try {
      return await this.songRepository.requireSongEntry(this.songName!)
    } catch (e) {
      history.back();
      throw e;
    }
  }

  getPatternChords(patternInStructure: PatternInStructure): Chords {
    return patternInStructure.pattern.chords || Chords.repeatNoChord(patternInStructure.pattern.durationInBars);
  }

  onDestroy() {
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
