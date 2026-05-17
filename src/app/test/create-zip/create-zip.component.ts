import {ChangeDetectionStrategy, Component} from '@angular/core';
import {downloadJsonFile} from "../../utils/file-utils";
import {SongRepository} from "../../song/song-repository";
import {SongEntry} from "../../song/song-entry";
import {StructureMapper} from "../../json/parsers/structure-mapper.service";
import {FormsModule} from "@angular/forms";
import {RECORDING_JSON, STRUCTURE_JSON} from "../../song/song-archive";
import {error, NonUndefined} from "../../utils";

const songNames: string[] = [];

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

    get songEntry(): Promise<SongEntry> {
        return this.songRepository.requireSongEntry(this.songName!);
    }

    async downloadStructureJsonV1(): Promise<void> {
        const songEntry = await this.songEntry;
        const structure = songEntry.structure;
        this.downloadAsJson(STRUCTURE_JSON, {
            parts: structure.partsInStructure.map(partInStructure => partInStructure.part),
        });
    }

    async downloadStructureJson(): Promise<void> {
        const songEntry = await this.songEntry;
        const structure = songEntry.structure;
        const jsonStructure = this.structureMapper.dto(structure)
        this.downloadAsJson(STRUCTURE_JSON, jsonStructure);
    }

    async downloadRecordingJson(): Promise<void> {
        const songEntry = await this.songEntry;
        const recording = songEntry.recording;
        if (!recording) error(`Aucun enregistrement`);
        this.downloadAsJson(RECORDING_JSON, recording);
    }

    downloadAsJson<T>(filename: string, obj: NonUndefined<T>): void {
        downloadJsonFile(filename, JSON.stringify(obj, undefined, 2));
    }

    protected readonly songNames = songNames;
}
