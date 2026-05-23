import {WarpMarker} from "../structure/warp-marker";
import {Midi, TimeSignature} from "./recording";

export interface RecordingDto {
    name: string
    sampleDurationInSeconds: number
    warpMarkers: WarpMarker[]
    timeSignature?: TimeSignature
    midi?: Midi
    musicXmlString?: string
}
