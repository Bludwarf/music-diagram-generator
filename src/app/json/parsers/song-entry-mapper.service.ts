import {StructureMapper} from "./structure-mapper.service";
import {RecordingMapper} from "./recording-mapper.service";
import {Injectable} from "@angular/core";
import {SongEntry} from "../../song/song-entry";
import {StructureDto} from "../../structure/structure-dto";
import {SongInArchive} from "../../song/song-archive";
import {RecordingDto} from "../../recording/recording-dto";

@Injectable({
    providedIn: 'root'
})
export class SongEntryMapper {

    constructor(
        private readonly structureMapper: StructureMapper,
        private readonly recordingMapper: RecordingMapper,
    ) {
    }

    async model(songName: string, version: string | undefined, structure: StructureDto, recordingDto?: RecordingDto): Promise<SongEntry> {
        return {
            name: songName,
            version,
            structure: this.structureMapper.model(structure),
            recording: recordingDto ? this.recordingMapper.model(recordingDto) : undefined,
        };
    }

    async modelFromSong(song: SongInArchive): Promise<SongEntry> {
        const structure = await song.structure;
        const recording = await song.recording;
        return await this.model(song.name, song.version, structure, recording);
    }
}
