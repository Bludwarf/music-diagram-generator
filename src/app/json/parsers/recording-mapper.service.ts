import {Injectable} from "@angular/core";
import {Recording} from "../../recording/recording";
import {ModelDtoMapper} from "./model-dto-mapper";
import {RecordingDto} from "../../recording/recording-dto";

@Injectable({
    providedIn: 'root'
})
export class RecordingMapper implements ModelDtoMapper<Recording, RecordingDto> {

    dto(model: Recording): RecordingDto {
        return model;
    }

    model(dto: RecordingDto): Recording {
        return new Recording(
            dto.name,
            dto.sampleDurationInSeconds,
            dto.warpMarkers,
            dto.midi,
            dto.musicXmlString,
        );
    }
}
