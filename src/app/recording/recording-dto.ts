import {WarpMarker} from "../structure/warp-marker";
import {Midi} from "./recording";

export interface RecordingDto {
    name: string
    sampleDurationInSeconds: number
    warpMarkers: WarpMarker[]
    midi?: Midi
    musicXmlString?: string
}
