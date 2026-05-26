import {computed, ElementRef, input, InputSignal, signal} from '@angular/core';
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {BarNumber0Indexed, Chords} from "../../notes";
import {RythmBarEvent} from "../../rythm-bar/event";
import {loaded, Player, start, Time as ToneTime, Transport} from "tone";
import {BeatTime, Position, PositionedElement, PositionFormatter, SecTime} from "../../time";
import {error, sequence, stripExtension} from '../../utils';
import {SampleCacheService} from '../../sample/samples-cache.service';
import {ToneAdapter} from "../../tonejs/tone-adapter";
import NoSleep from 'nosleep.js';
import {Subject} from "rxjs";
import {SongEntry} from "../../song/song-entry";

export abstract class MobileRehearsal {

    debug = false
    fileInput?: ElementRef<HTMLInputElement>;

    private readonly noSleep = new NoSleep();

    get progress(): number {
        return Math.min(Math.max(0, Transport.progress), 1) * 100
    }

    get timecode(): string | undefined {
        const position = this.position()
        return position ? PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position) : undefined
    }

    secTime = signal(new SecTime(0))

    roundedTransportSeconds = signal(0);

    beatTime = signal<BeatTime>(new BeatTime(0))

    position = computed(() => {
        const beatTime = this.beatTime();
        return this.structure().getPosition(beatTime)
    })

    currentChord = computed(() => this.currentPatternInStructure().getChordAt(this.position()))
    currentBar = computed(() => this.position().bars)
    currentPatternInStructure = computed(() => this.structure().getPatternInStructureAtBar(this.currentBar()))
    currentSectionInStructure = computed(() => this.currentPatternInStructure().sectionInStructure)
    currentPartInStructure = computed(() => this.currentSectionInStructure().partInStructure)

    currentKey = computed(() => this.currentPatternInStructure().getKeyAt(this.position()))

    abstract songEntry: InputSignal<SongEntry>;
    structure = computed(() => this.songEntry().structure);
    recording = computed(() => this.songEntry().recording);

    get rythmBarTimecode(): string | undefined {
        const position = this.position();
        if (!position) {
            return undefined;
        }

        const currentPatternInStructure = this.currentPatternInStructure();
        if (!currentPatternInStructure?.eventsStartPosition) {
            return undefined;
        }

        return PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position
            .relativeTo(currentPatternInStructure.startPosition)
            .modBars(currentPatternInStructure.eventsDurationInBars)
            .addBars(currentPatternInStructure.eventsStartPosition.bars));
    }

    get transportBeatTime(): number | undefined {
        return this.beatTime()?.value
    }

    protected sequence = sequence

    player?: Player
    sampleIsLoaded = false
    playButtonIsDisabled = false

    songName?: string
    loopedElement?: PositionedElement;

    protected constructor(
        protected readonly toneAdapter: ToneAdapter,
        private readonly sampleCacheService: SampleCacheService,
    ) {
    }

    onInit() {
        this.scheduleAll();
    }

    protected scheduleAll(): void {
        this.scheduleTransportSeconds();
        this.schedulePositionedElements();
    }

    private scheduleTransportSeconds() {
        const recording = this.recording();
        if (recording) {
            for (let roundedTransportSeconds = 0; roundedTransportSeconds < recording.sampleDurationInSeconds; ++roundedTransportSeconds) {
                Transport.schedule(() => {
                    this.roundedTransportSeconds.set(roundedTransportSeconds)
                }, roundedTransportSeconds);
            }
        }
    }

    private schedulePositionedElements() {
        const recording = this.recording();
        if (!recording) return

        const partsInStructure = this.structure().partsInStructure;
        if (!partsInStructure) return

        partsInStructure.forEach(partInStructure => {
            partInStructure.sectionsInStructure.forEach(sectionInStructure => {
                sectionInStructure.patternsInStructure.forEach(patternInStructure => {
                    // TODO boucles extérieures inutiles => boucle sur tous les quarters de la structure
                    patternInStructure.forEachQuarter(beatTime => {
                        const secTime = recording.getSecTime(beatTime);
                        if (secTime !== undefined) {
                            this.toneAdapter.schedule(() => {
                                this.beatTime.set(beatTime);
                            }, secTime.value);
                        }
                    })
                })
            })
        })
    }

    addEvent(event: RythmBarEvent): void {
        // this.events.push(event);
        // this.logEvents();
    }

    removeEvent(event: RythmBarEvent): void {
        // this.events.splice(this.events.indexOf(event), 1);
        // this.logEvents();
    }

    async uploadFile(event: Event): Promise<void> {
        const recording = this.recording();
        if (!recording) {
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
            if (nameWithoutExtension !== recording.name) {
                alert(`Le nom du fichier chargé "${audioFile.name}" ("${nameWithoutExtension}" sans extension) ne correspond pas à celui de l'enregistrement "${recording.name}"`)
            }
            this.sampleCacheService.setFile(recording.name, audioFile)
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
            // loopEnd: this.structure().sampleDuration.toSeconds(),
        }).toDestination();

        // cf. https://github.com/Tonejs/Tone.js/blob/dev/examples/daw.html
        Transport.bpm.value = 120;
        if (!this.loopedElement && this.recording()) {
            this.loopOnRecording()
        }

        player.sync().start(0)
        this.player = player

        await loaded() // évite les erreurs de buffer
        await start()

        this.sampleIsLoaded = true

        await this.playSong();
    }

    loopOnRecording(): void {
        const recording = this.recording()
        if (!recording) {
            error('Aucun enregistrement (Recording)')
        }
        Transport.loop = true
        Transport.loopStart = 0
        Transport.loopEnd = recording.sampleDurationInSeconds // structure.duration.toBarsBeatsSixteenths()
        delete this.loopedElement
    }

    protected resetStates(selectedPosition?: Position) {
        // Si besoin, dans les composants enfants
    }

    async playSong(): Promise<void> {
        this.playButtonIsDisabled = true;
        if (!this.sampleIsLoaded) {
            const recording = this.recording();
            if (!recording) {
                this.playButtonIsDisabled = false;
                error('Aucun enregistrement (Recording)')
            }

            await this.playOrUploadAndPlayAudio(recording.name);
        }

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
        Transport.pause()
        this.noSleep.disable();
        this.playButtonIsDisabled = false;
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
        if (this.recording()) {
            elementToLoop ? this.loopOn(elementToLoop) : this.loopOnRecording();
        }

        if (!isCurrentInStructure) {
            this.setPosition(element.startPosition);
        }
    }

    setPosition(position: Position) {
        const beatTime = this.structure().getBeatTimeAt(position);
        this.beatTime.set(beatTime)

        const secTime = this.recording()?.getSecTime(beatTime);
        if (secTime !== undefined) {
            Transport.seconds = secTime.value
            this.secTime.set(secTime)
            this.roundedTransportSeconds.set(Math.round(secTime.value))
            this.resetStates(position);
        }
    }

    isCurrentInStructure(element: any): boolean {
        return element && (element === this.currentPartInStructure() || element === this.currentSectionInStructure() || element === this.currentPatternInStructure())
    }

    private loopOn(element: PositionedElement) {
        let looped = false
        const recording = this.recording();

        if (this.loopedElement !== element) {
            if (!recording) {
                error('Aucun enregistrement (Recording)')
            }

            const wrappedStartTime = recording.getSecTime(this.structure().getBeatTimeAt(element.startPosition));
            if (wrappedStartTime !== undefined) {
                const wrappedEndTime = recording.getSecTime(this.structure().getBeatTimeAt(element.endPosition));
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
        } else if (recording) {
            this.loopOnRecording()
        }
    }

    onClickBar(bar: BarNumber0Indexed): void {
        const barAsPositionedElement = this.getBarAsPositionedElement(bar);
        this.onClickElementInStructure(barAsPositionedElement, bar === this.currentBar())
    }

    getBarAsPositionedElement(bar: BarNumber0Indexed): PositionedElement {
        const startPosition = new Position(bar)
        const endPosition = startPosition.addBars(1);
        return {
            startPosition,
            endPosition,
        }
    }

    get currentBarAsPositionedElement(): PositionedElement {
        return this.getBarAsPositionedElement(this.currentBar())
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

    getPatternChords(patternInStructure: PatternInStructure): Chords {
        return patternInStructure.pattern.chords || Chords.repeatNoChord(patternInStructure.pattern.durationInBars);
    }

    onDestroy() {
        if (this.player) {
            this.player.unsync()
            this.player.dispose()
            delete this.player
        }
        this.stopSong()
    }
}

export type ViewType = 'A' | 'B' | 'B-maq' | 'P' | 'P-osmd' | 'C'
