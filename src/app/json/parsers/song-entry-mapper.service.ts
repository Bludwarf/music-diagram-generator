import {StructureMapper} from "./structure-mapper.service";
import {RecordingMapper} from "./recording-mapper.service";
import {Injectable} from "@angular/core";
import {SongEntry} from "../../song/song-entry";
import {StructureDto} from "../../structure/structure-dto";
import {SongInFileSystem} from "../../song/song-archive";
import {RecordingDto} from "../../recording/recording-dto";
import {DEFAULT_MIDI_TIME_SIGNATURE} from "../../structure/structure";
import {BarTimeSignatureGetter} from "../../notes";
import {Midi, MidiWrapper} from "../../midi";

@Injectable({
    providedIn: 'root'
})
export class SongEntryMapper {

    constructor(
        private readonly structureMapper: StructureMapper,
        private readonly recordingMapper: RecordingMapper,
    ) {
    }

    async model(songName: string, version: string | undefined, structureDto: StructureDto, recordingDto?: RecordingDto, midi?: Midi, musicXml?: string): Promise<SongEntry> {
        const midiWrapper = midi ? new MidiWrapper(midi) : undefined;
        const barTimeSignatureGetter: BarTimeSignatureGetter = (bar: number) => {
            if (!midiWrapper) {
                if (structureDto.timeSignature) {
                    return structureDto.timeSignature
                }
                const timeSignature = DEFAULT_MIDI_TIME_SIGNATURE.timeSignature
                console.warn(`Sans MIDI on considère que la signature rythmique du morceau "${songName}" est du ${timeSignature[0]}/${timeSignature[1]}`)
                return timeSignature
            }
            return midiWrapper.getTimeSignature("measures", bar).timeSignature
        }
        return {
            name: songName,
            version,
            structure: this.structureMapper.model(structureDto, barTimeSignatureGetter, midi, musicXml),
            recording: recordingDto ? this.recordingMapper.model(recordingDto) : undefined,
        };
    }

    async modelFromSong(song: SongInFileSystem): Promise<SongEntry> {
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
