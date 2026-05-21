import {Injectable} from "@angular/core";
import {Midi, Recording} from "../../recording/recording";
import {ModelDtoMapper} from "./model-dto-mapper";
import {RecordingDto} from "../../recording/recording-dto";
import {error} from "../../utils";

@Injectable({
    providedIn: 'root'
})
export class RecordingMapper implements ModelDtoMapper<Recording, RecordingDto> {

    dto(model: Recording): RecordingDto {
        return model;
    }

    model(dto: RecordingDto, standaloneMidi?: Midi, standaloneMusicXmlString?: string): Recording {
        if (dto.midi && standaloneMidi) error(`Midi défini deux fois pour l'enregistrement "${dto.name}"`)
        if (dto.musicXmlString && standaloneMusicXmlString) error(`MusicXmlString défini deux fois pour l'enregistrement "${dto.name}"`)
        return new Recording(
            dto.name,
            dto.sampleDurationInSeconds,
            dto.warpMarkers,
            dto.midi ?? standaloneMidi,
            dto.musicXmlString ?? standaloneMusicXmlString,
        );
    }
}
