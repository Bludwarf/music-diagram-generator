import {StructureDto, StructureMapper} from "./structure-mapper.service";
import {RecordingMapper} from "./recording-mapper.service";
import {Injectable} from "@angular/core";
import {Recording} from "../../recording/recording";
import {SongEntry} from "../../song/song-entry";
import {ModelDtoMapper} from "./modelDtoMapper";

@Injectable({
    providedIn: 'root'
})
export class SongEntryMapper {

    constructor(
        private readonly structureMapper: StructureMapper,
        private readonly recordingMapper: RecordingMapper,
    ) {
    }

    async model(songName: string, structure: StructureDto, recording: Recording): Promise<SongEntry> {
        return {
            name: songName,
            structure: this.structureMapper.model(structure),
            recording: this.recordingMapper.model(recording),
        };
    }
}
