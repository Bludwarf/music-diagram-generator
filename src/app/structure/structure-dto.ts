import {TimeSignature} from "../time";

export interface StructureDto {
    parts: PartDto[],
    patterns: PatternDto[],
    timeSignature?: TimeSignature,
}

export interface PartDto {
    name: string;
    /** On utilise un DTO et pas le nom, car il peut y avoir différentes sections portant le même nom */
    sections: SectionDto[];
}

export interface SectionDto {
    name: string;
    patternInitials: string[];
    initial?: string,
    color?: string;
}

export interface PatternDto {
    name: string;
    durationInBars?: number;
    initial: string;
    key?: KeyDto,
    asciiChords?: string;
    events?: any, // TODO type vraiment inconnu // TODO ce serait mieux de le mettre dans un autre fichier
    color?: string,
}

type KeyDto = [number, number]; // TODO il faut que le JSON soit lisible et modifiable par un humain
