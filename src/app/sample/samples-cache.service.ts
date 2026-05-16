import {Injectable} from "@angular/core";

type BlobGetter = () => Promise<Blob>;

@Injectable({
    providedIn: 'root'
})
export class SampleCacheService {
    private audioFilesByRecordingName: Record<string, File> = {}
    private audioBlobGettersByRecordingName: Record<string, BlobGetter> = {}

    setFile(recordingName: string, audioFile: File): void {
        this.audioFilesByRecordingName[recordingName] = audioFile
    }

    setAudio(recordingName: string, audioGetter: BlobGetter): void {
        this.audioBlobGettersByRecordingName[recordingName] = audioGetter;
    }

    async get(recordingName: string): Promise<Blob | undefined> {
        const audioFile = this.getFile(recordingName)
        if (audioFile) {
            return audioFile;
        } else {
            const audio = await this.getAudio(recordingName);
            if (audio) {
                return audio;
            }
        }
        return undefined;
    }

    private getFile(recordingName: string): File {
        return this.audioFilesByRecordingName[recordingName]
    }

    private async getAudio(recordingName: string): Promise<Blob | undefined> {
        const blobGetter = this.audioBlobGettersByRecordingName[recordingName];
        if (!blobGetter) return undefined;
        return await blobGetter();
    }
}
