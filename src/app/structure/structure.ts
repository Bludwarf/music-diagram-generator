import {BeatTime, Position, TimeSignature} from "../time";
import {Pattern} from "./pattern/pattern";
import {PatternInStructure} from "./pattern/pattern-in-structure";
import {SectionInStructure} from "./section/section-in-structure";
import {Part} from "./part/part";
import {PartInStructure} from "./part/part-in-structure";
import {BaseColor as Color, ColorResolver} from "../color";
import {Section} from "./section/section";
import {Midi, MidiTimeSignature} from "../midi";

class StructureBuilder {
    private _parts?: Part[];
    private defaultPart?: Part
    private defaultSection?: Section
    private readonly getEventsStartPosition?: (pattern: Pattern) => (Position) | undefined;
    private readonly getEventsDurationInBars?: (pattern: Pattern) => number | undefined

    parts(parts: typeof this._parts) {
        this._parts = parts
        return this
    }

    add(pattern: Pattern): this {
        this.addPattern(pattern)
        return this
    }

    addPattern(pattern: Pattern): this {
        const part = this.getOrCreateDefaultPart()
        part.sections[0].patterns.push(pattern)
        return this
    }

    private getOrCreateDefaultPart(): Part {
        if (!this.defaultPart) {
            const section = this.getOrCreateDefaultSection()
            this.defaultPart = new Part('DefaultPart', [
                section,
            ])
            this._parts ??= [];
            this._parts.push(this.defaultPart)
        }
        return this.defaultPart
    }

    private getOrCreateDefaultSection(): Section {
        this.defaultSection ??= new Section('DefaultSection', []);
        return this.defaultSection
    }

    build(): Structure {
        let parts: Part[] | undefined
        if (this._parts) {
            parts = this._parts
        }
        if (!parts) {
            throw new Error('Missing parts')
        }

        return new Structure(
            parts,
            this.getEventsStartPosition,
            this.getEventsDurationInBars
        )
    }
}

export const DEFAULT_MIDI_TIME_SIGNATURE: MidiTimeSignature = {
    ticks: 0,
    timeSignature: [4, 4],
    measures: 0,
};

export class Structure {

    key = 'Gm (mock)'; // TODO
    readonly partsInStructure: PartInStructure[];
    private readonly colorResolver = new ColorResolver(this)

    // TODO info pour savoir qui commence (ou quel instrument ou quelle piste)
    // TODO info pour marquer le type de fin (sur le 1, brutal, normal, fondu, ralenti)

    constructor(
        parts: Part[],
        getEventsStartPosition?: (pattern: Pattern) => Position | undefined, // TODO en attendant de savoir comment faire les events
        getEventsDurationInBars?: (pattern: Pattern) => number | undefined, // TODO en attendant de savoir comment faire les events
        readonly timeSignature?: TimeSignature,
        readonly midi?: Midi,
        readonly musicXmlString?: string,
    ) {

        let currentPosition = new Position();

        const partsInStructure: PartInStructure[] = []
        for (const part of parts) {

            const sectionsInStructure: SectionInStructure[] = []
            for (const section of part.sections) {

                const patternsInStructure: PatternInStructure[] = []
                for (const pattern of section.patterns) {
                    patternsInStructure.push(new PatternInStructure(pattern, currentPosition, getEventsStartPosition?.(pattern), getEventsDurationInBars?.(pattern)))
                    currentPosition = currentPosition.addBars(pattern.durationInBars)
                }

                const sectionInStructure = new SectionInStructure(section, patternsInStructure)
                sectionsInStructure.push(sectionInStructure)
            }

            const partInStructure = new PartInStructure(part, this, sectionsInStructure)
            partsInStructure.push(partInStructure)
        }

        this.partsInStructure = partsInStructure
    }

    getPartInStructureAt(position: Position): PartInStructure {
        return Position.getElementAtWithOverflow(position, this.partsInStructure)
    }

    getPatternInStructureAtBar(bar: number) { // TODO cache
        const position = new Position(bar);
        return Position.getElementAtWithOverflow(position, this.patternsInStructure)
    }

    static builder(): StructureBuilder {
        return new StructureBuilder()
    }

    get patternsInStructure(): PatternInStructure[] {
        return this.partsInStructure.flatMap(partInStructure =>
            partInStructure.patternsInStructure
        )
    }

    getPatternColor(patternInStructure: PatternInStructure): Color {
        return this.colorResolver.getPatternColor(patternInStructure)
    }

    get durationInBars(): number {
        let durationInBars = 0;
        for (const partInStructure of this.partsInStructure) {
            durationInBars += partInStructure.part.durationInBars
        }
        return durationInBars;
    }

    getPosition(beatTime: BeatTime): Position {
        const currentTimeSignature = this.getMidiTimeSignature(beatTime);

        let beatTimeFromCurrentTimeSignature = beatTime;
        if (this.midi) {
            const ticks = beatTime.toMidiTicks(this.midi.header.ppq);
            const ticksFromCurrentTimeSignature = ticks - currentTimeSignature.ticks;
            beatTimeFromCurrentTimeSignature = BeatTime.fromMidiTicks(ticksFromCurrentTimeSignature, this.midi.header.ppq);
        }

        return this.getPositionWithTimeSignature(beatTimeFromCurrentTimeSignature, currentTimeSignature);
    }

    private getPositionWithTimeSignature(beatTime: BeatTime, currentTimeSignature: MidiTimeSignature) {
        const [tsNum, tsDen] = currentTimeSignature.timeSignature;
        const quartersPerBar = tsNum * BeatTime.SIGNATURE[1] / tsDen;
        const quartersPerBeat = 1 / (tsDen / BeatTime.SIGNATURE[1]); // = BEAT[1] / tsDen
        const quartersPerSixteenth = 1 / 4

        let remaining = beatTime.value;

        const bars = Math.floor(remaining / quartersPerBar);
        remaining -= bars * quartersPerBar;

        const beats = Math.floor(remaining / quartersPerBeat);
        remaining -= beats * quartersPerBeat;

        const sixteenths = Math.floor(remaining / quartersPerSixteenth);

        return new Position(
            currentTimeSignature.measures + bars,
            beats,
            sixteenths,
        );
    }

    getBeatTimeAt(position: Position): BeatTime {
        const currentTimeSignature = this.getMidiTimeSignatureAt(position);
        const currentTimeSignatureBeatTime = BeatTime.fromMidiTicks(currentTimeSignature.ticks, this.midi?.header?.ppq);
        return this.getBeatTimeWithTimeSignatureAt(currentTimeSignature, currentTimeSignatureBeatTime, position);
    }

    private getBeatTimeWithTimeSignatureAt(currentTimeSignature: MidiTimeSignature, currentTimeSignatureBeatTime: BeatTime, position: Position) {
        const barsFromCurrentTimeSignature = position.bars - currentTimeSignature.measures;
        // TODO facto à faire ?
        const valueFactor = currentTimeSignature.timeSignature[1] / BeatTime.SIGNATURE[1]
        return new BeatTime(currentTimeSignatureBeatTime.value
            + barsFromCurrentTimeSignature * currentTimeSignature.timeSignature[0] / valueFactor
            + position.beats
            + position.sixteenths / 4);
    }

    private _midiTimeSignature: MidiTimeSignature | undefined;
    get midiTimeSignature(): MidiTimeSignature {
        if (!this.timeSignature) return DEFAULT_MIDI_TIME_SIGNATURE;
        this._midiTimeSignature ??= {
            ...DEFAULT_MIDI_TIME_SIGNATURE,
            timeSignature: this.timeSignature,
        };
        return this._midiTimeSignature
    }

    private getMidiTimeSignature(beatTime: BeatTime): MidiTimeSignature {
        let currentTimeSignature = this.midiTimeSignature;

        if (this.midi) {
            const ticks = beatTime.toMidiTicks(this.midi.header.ppq);
            currentTimeSignature = this.findCurrentTimeSignature(ticks);
        }

        return currentTimeSignature;
    }

    private getMidiTimeSignatureAt(position: Position): MidiTimeSignature {
        if (!this.midi) {
            return this.midiTimeSignature
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignature
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.measures > position.bars);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }

    private findCurrentTimeSignature(ticks: number): MidiTimeSignature {
        if (!this.midi) {
            throw new Error(`Impossible de trouver la signature rythmique courante sans données MIDI`);
        }
        // TODO calcul à mettre dans une lib/util
        // TODO facto avec getMidiTimeSignatureAt
        const nextTimeSignatureIndex = this.midi.header.timeSignatures.findIndex(timeSignature => timeSignature.ticks > ticks);
        const timeSignatureIndex = nextTimeSignatureIndex === -1 ? this.midi.header.timeSignatures.length - 1 : (nextTimeSignatureIndex === 0 ? 0 : nextTimeSignatureIndex - 1);
        return this.midi.header.timeSignatures[timeSignatureIndex];
    }
}
