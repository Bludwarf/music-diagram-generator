import {Structure} from "../structure/structure";
import {Recording} from "../recording/recording";

export interface SongEntry {
    name: string
    version?: string // TODO à mettre en obligatoire dès que tous les songs l'utilisent
    structure: Structure
    recording?: Recording
}

export const EMPTY: SongEntry = {
    name: 'Intro',
    version: '1',
    structure: Structure.builder()
        .parts([])
        .build(),
}
