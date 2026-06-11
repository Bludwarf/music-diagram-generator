import {Structure} from "../structure/structure";
import {Recording} from "../recording/recording";

export interface SongEntry {
    name: string
    version?: string
    structure: Structure
    recording?: Recording
}

export const EMPTY: SongEntry = {
    name: '(Morceau inconnu)',
    structure: Structure.builder()
        .parts([])
        .build(),
}
