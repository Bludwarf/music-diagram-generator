import {WarpMarker} from "../structure/warp-marker";

export interface RecordingDto {
    name: string
    sampleDurationInSeconds: number
    warpMarkers: WarpMarker[]
}
