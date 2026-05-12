import {StructureMapper} from "./structure-mapper.service";
import {RecordingMapper} from "./recording-mapper.service";
import {Injectable} from "@angular/core";
import {Recording} from "../../recording/recording";
import {SongEntry} from "../../song/song-entry";
import {StructureDto} from "../../structure/structure-dto";

@Injectable({
    providedIn: 'root'
})
export class SongEntryMapper {

    constructor(
        private readonly structureMapper: StructureMapper,
        private readonly recordingMapper: RecordingMapper,
    ) {
    }

    async model(songName: string, version: string | undefined, structure: StructureDto, recording?: Recording): Promise<SongEntry> {
        return {
            name: songName,
            version,
            structure: this.structureMapper.model(structure),
            recording: recording ? this.recordingMapper.model(recording) : undefined,
        };
    }
}
