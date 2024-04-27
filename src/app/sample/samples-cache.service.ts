import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SampleCacheService {
    private audioFilesByRecordingName: Record<string, File> = {}

    set(recordingName: string, audioFile: File): void {
        this.audioFilesByRecordingName[recordingName] = audioFile
    }

    get(recordingName: string): File {
        return this.audioFilesByRecordingName[recordingName]
    }
}