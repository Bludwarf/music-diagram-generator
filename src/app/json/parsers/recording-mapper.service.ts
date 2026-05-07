import {Injectable} from "@angular/core";
import {Recording} from "../../recording/recording";
import {ModelDtoMapper} from "./modelDtoMapper";

@Injectable({
    providedIn: 'root'
})
export class RecordingMapper implements ModelDtoMapper<Recording, Recording> {

    dto(model: Recording): Recording {
        return model;
    }

    model(dto: Recording): Recording {
        return new Recording(
            dto.name,
            dto.sampleDurationInSeconds,
            dto.sampleBeatTimeDuration,
            dto.warpMarkers,
            dto.warpMarkers.length,
            dto.midi,
            dto.musicXmlString,
        );
    }
}
