import {StructureMapper} from "./structure-mapper.service";
import {RecordingMapper} from "./recording-mapper.service";
import {Injectable} from "@angular/core";
import {SongEntry} from "../../song/song-entry";
import {StructureDto} from "../../structure/structure-dto";
import {SongInArchive} from "../../song/song-archive";
import {RecordingDto} from "../../recording/recording-dto";
import {DEFAULT_MIDI_TIME_SIGNATURE, Midi} from "../../recording/recording";
import {BarTimeSignatureGetter} from "../../notes";

@Injectable({
    providedIn: 'root'
})
export class SongEntryMapper {

    constructor(
        private readonly structureMapper: StructureMapper,
        private readonly recordingMapper: RecordingMapper,
    ) {
    }

    async model(songName: string, version: string | undefined, structure: StructureDto, recordingDto?: RecordingDto, midi?: Midi, musicXml?: string): Promise<SongEntry> {
        const recording = recordingDto ? this.recordingMapper.model(recordingDto, midi, musicXml) : undefined;
        const barTimeSignatureGetter: BarTimeSignatureGetter = (bar: number) => {
            if (!recording) {
                const timeSignature = DEFAULT_MIDI_TIME_SIGNATURE.timeSignature
                console.warn(`Sans enregistrement on considère que la signature rythmique du morceau "${songName}" est du ${timeSignature[0]}/${timeSignature[1]}`)
                return timeSignature
            }
            return recording.getTimeSignature(bar)
        }
        return {
            name: songName,
            version,
            structure: this.structureMapper.model(structure, barTimeSignatureGetter),
            recording,
        };
    }

    async modelFromSong(song: SongInArchive): Promise<SongEntry> {
        const structure = await song.structure;
        return await this.model(
            song.name,
            song.version,
            structure,
            await song.recording,
            await song.midi,
            await song.musicXml,
        );
    }
}
