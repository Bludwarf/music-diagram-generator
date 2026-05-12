import {ChangeDetectionStrategy, Component} from '@angular/core';
import {downloadJsonFile} from "../../utils/file-utils";
import {SongRepository} from "../../song/song-repository";
import {SongEntry} from "../../song/song-entry";
import {StructureMapper} from "../../json/parsers/structure-mapper.service";
import {FormsModule} from "@angular/forms";
import {RECORDING_JSON, STRUCTURE_JSON} from "../../song/song-archive";
import {error, NonUndefined} from "../../utils";

const songNames = [
    "Aucun respect",
    "Au son des bars",
    "Elle rêve à quoi",
    "Happy",
    "La 4L",
    "Intro",
    "Kas a-barh",
    "La femme dragon",
    "Le jour (le phare)",
    "Mirages",
    "Noyer le silence",
    "Nuages blancs",
    "Petit Papillon",
    "Le résistant",
    "Rockollection",
    "Solitude",
    "Surcouf",
    "Tout foufou",
    "The Sims - If You Really See Eurydice"
];

@Component({
    selector: 'app-create-zip',
    imports: [
        FormsModule
    ],
    templateUrl: './create-zip.component.html',
    styleUrl: './create-zip.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateZipComponent {

    constructor(
        private readonly songRepository: SongRepository,
        private readonly structureMapper: StructureMapper,
    ) {
    }

    songName: string | undefined;

    get songEntry(): SongEntry {
        return this.songRepository.requireSongEntry(this.songName!);
    }

    downloadStructureJsonV1(): void {
        const structure = this.songEntry.structure;
        this.downloadAsJson(STRUCTURE_JSON, {
            parts: structure.partsInStructure.map(partInStructure => partInStructure.part),
        });
    }

    downloadStructureJson(): void {
        const structure = this.songEntry.structure;
        const jsonStructure = this.structureMapper.dto(structure)
        this.downloadAsJson(STRUCTURE_JSON, jsonStructure);
    }

    downloadRecordingJson(): void {
        const recording = this.songEntry.recording;
        if (!recording) error(`Aucun enregistrement`);
        this.downloadAsJson(RECORDING_JSON, recording);
    }

    downloadAsJson<T>(filename: string, obj: NonUndefined<T>): void {
        downloadJsonFile(filename, JSON.stringify(obj, undefined, 2));
    }

    protected readonly songNames = songNames;
}
