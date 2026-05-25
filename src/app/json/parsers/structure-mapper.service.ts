import {Injectable} from "@angular/core";
import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Pattern} from "../../structure/pattern/pattern";
import {BarTimeSignatureGetter, Chords, Key, Mode, Note} from "../../notes";
import {BaseColor} from "../../color";
import {Section} from "../../structure/section/section";
import {error, jsonEquals} from "../../utils";
import {ModelDtoMapper} from "./model-dto-mapper";
import {PartDto, PatternDto, SectionDto, StructureDto} from "../../structure/structure-dto";
import {Midi} from "../../midi";

function byKey<T>(items: T[], keyGetter: (item: T) => string): Record<string, T> {
    const byKey: Record<string, T> = {}
    for (const item of items) {
        const key = keyGetter(item);
        const alreadyExists = key in byKey;
        if (alreadyExists) {
            throw new Error(`Il existe déjà un élément avec la même clé "${key}"`);
        }
        byKey[key] = item;
    }
    return byKey;
}

class Elements<M, D> {
    readonly orderedKeys: string[] = [];
    readonly dtosByKey: Record<string, D> = {};

    constructor(
        readonly keyGetter: (item: M | D) => string,
        readonly dto: (model: M) => D,
    ) {
    }

    /**
     * @return undefined si model déjà connu
     */
    put(model: M): D | undefined {
        const dto = this.dto(model); // TODO ne pas refaire deux fois, si déjà fait dans la boucle

        const key = this.keyGetter(model);
        const alreadyExistingDto = this.dtosByKey[key];
        if (alreadyExistingDto) {
            if (!jsonEquals(dto, alreadyExistingDto)) {
                console.log("alreadyExistingDto", alreadyExistingDto);
                console.log("dto", dto);
                error(`Deux éléments différents portent la même clé "${key}"`)
            }
            return undefined;
        }

        this.orderedKeys.push(key);
        this.dtosByKey[key] = dto;
        return dto;
    }

    /**
     * @return undefined si model déjà connu
     */
    put2(model: M, dto: D) {
        const key = this.keyGetter(model);
        const alreadyExistingDto = this.dtosByKey[key];
        if (alreadyExistingDto) {
            if (!jsonEquals(dto, alreadyExistingDto)) {
                console.log("alreadyExistingDto", alreadyExistingDto);
                console.log("dto", dto);
                error(`Deux éléments différents portent la même clé "${key}"`)
            }
            return undefined;
        }

        this.orderedKeys.push(key);
        this.dtosByKey[key] = dto;
        return dto;
    }

    get dtos(): D[] {
        return this.orderedKeys.map(key => this.dtosByKey[key]);
    }
}

@Injectable({
    providedIn: 'root'
})
export class StructureMapper {
    constructor(
        private readonly patternParser: PatternParser,
        private readonly colorParser: ColorParser,
    ) {
    }

    dto(model: Structure): StructureDto {
        const parts = model.partsInStructure.map(partInStructure => partInStructure.part);
        const partsDtos: PartDto[] = [];

        const patternsSet = new Elements<Pattern, PatternDto>(
            pattern => pattern.initial,
            model => this.patternParser.dto(model),
        );

        for (const part of parts) {

            const partDto = this.partDtoWithoutChildren(part);

            for (const section of part.sections) {
                const sectionDto = this.dtoSection(section);

                for (const pattern of section.patterns) {
                    const patternDto = this.patternParser.dto(pattern);
                    patternsSet.put2(pattern, patternDto);
                    sectionDto.patternInitials.push(pattern.initial);
                }

                partDto.sections.push(sectionDto);
            }

            partsDtos.push(partDto);
        }

        return {
            parts: partsDtos,
            patterns: patternsSet.dtos,
            timeSignature: model.timeSignature,
        }
    }

    model(dto: StructureDto, barTimeSignatureGetter: BarTimeSignatureGetter, midi?: Midi, musicXml?: string): Structure {
        const patternsByInitial = byKey(dto.patterns, item => item.initial);
        return new Structure(
            dto.parts.map(part => this.partModel(part, patternsByInitial, barTimeSignatureGetter)),
            undefined,
            undefined,
            dto.timeSignature,
            midi,
            musicXml,
        )
    }

    private partDtoWithoutChildren(model: Part): PartDto {
        return {
            name: model.name,
            sections: [],
        }
    }

    private partModel(dto: PartDto, patternsByInitial: Record<string, PatternDto>, barTimeSignatureGetter: BarTimeSignatureGetter) {
        return new Part(
            dto.name,
            dto.sections.map(sectionDto => this.modelSection(sectionDto, patternsByInitial, barTimeSignatureGetter)),
        );
    }

    private dtoSection(model: Section): SectionDto {
        return {
            name: model.name,
            patternInitials: [],
        }
    }

    private modelSection(dto: SectionDto, patternByInitial: Record<string, PatternDto>, barTimeSignatureGetter: BarTimeSignatureGetter): Section {
        return new Section(
            dto.name,
            dto.patternInitials.map(initial => {
                const patternDto = patternByInitial[initial];
                if (!patternDto) error(`Pattern portant l'initial "${initial}" introuvable pour la section ${dto.name}`);
                return this.patternParser.model(patternDto, barTimeSignatureGetter);
            }),
            dto.initial,
            dto.color ? this.colorParser.model(dto.color) : undefined,
        );
    }

}

@Injectable({
    providedIn: 'root'
})
export class PatternParser {


    constructor(
        private readonly keyParser: KeyParser,
        private readonly colorParser: ColorParser,
    ) {
    }

    dto(model: Pattern): PatternDto {
        const asciiChords = model.chords?.ascii;
        return {
            name: model.name,
            durationInBars: asciiChords ? undefined : model.durationInBars,
            initial: model.initial,
            key: model.key ? this.keyParser.dto(model.key) : undefined, // TODO undefined si idem morceau
            asciiChords,
            events: model.events,
            color: model.color ? this.colorParser.dto(model.color) : undefined,
        }
    }

    model(dto: PatternDto, barTimeSignatureGetter: BarTimeSignatureGetter): Pattern {
        const chords = dto.asciiChords ? Chords.fromAsciiChords(dto.asciiChords, barTimeSignatureGetter) : undefined;
        return new Pattern(
            dto.name,
            chords ? chords.durationInBars : dto.durationInBars!,
            dto.initial,
            dto.key ? this.keyParser.model(dto.key) : undefined,
            chords,
            dto.events,
            undefined, // TODO : dto.fretboard,
            dto.color ? this.colorParser.model(dto.color) : undefined,
        );
    }

}

@Injectable({
    providedIn: 'root'
})
export class NoteParser implements ModelDtoMapper<Note, number> {
    dto(note: Note): number {
        return note.value;
    }

    model(value: number): Note {
        return Note.fromValue(value);
    }

}

@Injectable({
    providedIn: 'root'
})
export class ModeParser implements ModelDtoMapper<Mode, number> {
    dto(mode: Mode): number {
        return mode.value;
    }

    model(value: number): Mode {
        return Mode.fromValue(value);
    }

}

type KeyDto = [number, number]; // TODO il faut que le JSON soit lisible et modifiable par un humain

@Injectable({
    providedIn: 'root'
})
export class KeyParser implements ModelDtoMapper<Key, KeyDto> {

    constructor(
        private readonly noteParser: NoteParser,
        private readonly modeParser: ModeParser,
    ) {
    }

    dto(model: Key): KeyDto {
        return [model.note.value, model.mode.value];
    }

    model(dto: KeyDto): Key {
        return new Key(
            this.noteParser.model(dto[0]),
            this.modeParser.model(dto[1]),
        );
    }

}

@Injectable({
    providedIn: 'root'
})
export class ColorParser implements ModelDtoMapper<BaseColor, string> {

    dto(model: BaseColor): string {
        return model.colorType.hex();
    }

    model(dto: string): BaseColor {
        return new BaseColor(dto);
    }

}
