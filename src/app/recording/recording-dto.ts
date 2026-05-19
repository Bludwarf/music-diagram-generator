import {WarpMarker} from "../structure/warp-marker";
import {Midi} from "./recording";

export interface RecordingDto {
    name: string
    sampleDurationInSeconds: number
    sampleBeatTimeDuration: number
    warpMarkers: WarpMarker[]
    originalWarpMarkersLength?: number
    midi?: Midi
    musicXmlString?: string
}
