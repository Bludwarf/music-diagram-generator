import {ArchiveFile} from "unz";
import {unzipArchive} from "../utils/file-utils";
import {SongRepository} from "./song-repository";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";
import {StructureDto} from "../json/parsers/structure-mapper.service";
import {Recording} from "../recording/recording";
import {warn} from "../utils";

export const STRUCTURE_JSON = "structure.json"; // TODO à passer en private
export const RECORDING_JSON = "recording.json"; // TODO à passer en private
const SONG_ARCHIVE_FILE_NAMES = [
    STRUCTURE_JSON,
    RECORDING_JSON,
] as readonly string[];
export type SongArchiveFileName = typeof SONG_ARCHIVE_FILE_NAMES[number];

export class SongArchive {

    constructor(
        private readonly filesBySongName: Record<string, Record<SongArchiveFileName, ArchiveFile>>,
    ) {
    }

    static async fromZip(zip: File): Promise<SongArchive> {
        const archive = await unzipArchive(zip);
        const filesBySongName: Record<string, Record<SongArchiveFileName, ArchiveFile>> = {};
        for (const [fileName, archiveFile] of archive) {
            const indexOfSlash = fileName.indexOf("/");
            if (indexOfSlash === -1) {
                console.warn(`Fichier ignoré dans l'archive : ${fileName}`);
                continue;
            }

            const songName = fileName.substring(0, indexOfSlash);
            const songFileName = fileName.substring(indexOfSlash + 1);
            if (songFileName) {
                if (!(songName in filesBySongName)) filesBySongName[songName] = {};
                const songFilesBySongName = filesBySongName[songName];
                songFilesBySongName[songFileName] = archiveFile;
            }
        }

        return new SongArchive(filesBySongName);
    }

    get songNames(): string[] {
        return Object.keys(this.filesBySongName)
    }

    async getStructureOf(songName: string): Promise<StructureDto> {
        return await this.dto<StructureDto>(songName, STRUCTURE_JSON);
    }

    async getRecordingOf(songName: string): Promise<Recording> {
        return await this.dto<Recording>(songName, RECORDING_JSON);
    }

    private async dto<T>(songName: string, fileName: SongArchiveFileName): Promise<T> {
        const file = this.filesBySongName[songName][fileName];
        const json = await file?.text();
        return JSON.parse(json) as T
    }

    async pushSongsTo(songRepository: SongRepository, songEntryParser: SongEntryMapper) {
        for (const songName of this.songNames) {
            try {
                const structure = await this.getStructureOf(songName);
                const recording = await this.getRecordingOf(songName);
                const songEntry = await songEntryParser.model(songName, structure, recording);
                songRepository.pushAll(songEntry);
            } catch (e) {
                warn(`Erreur lors de l'ajout du morceau "${songName}"`, e);
            }
        }
    }
}
