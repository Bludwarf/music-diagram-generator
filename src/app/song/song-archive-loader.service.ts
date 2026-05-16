import {Injectable} from "@angular/core";
import {SongRepository} from "./song-repository";
import {SongEntry} from "./song-entry";
import {getAssetFile} from "../utils/file-utils";
import {SongArchive} from "./song-archive";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";
import {Observable, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Setlist} from "../setlist/setlist";
import {SetlistRepository} from "../setlist/setlist-repository";
import {SampleCacheService} from "../sample/samples-cache.service";

const DEFAULT_SONG = "Morceau par défaut";

@Injectable({
    providedIn: 'root'
})
export class SongArchiveLoader {

    constructor(
        private readonly songEntryMapper: SongEntryMapper,
        private readonly setlistRepository: SetlistRepository,
        private readonly sampleCacheService: SampleCacheService,
    ) {
    }

    isDefaultSong(songName: string): boolean {
        return songName === DEFAULT_SONG;
    }

    async getDefaultSetlist(songRepository: SongRepository): Promise<Setlist> {
        const zip = await getAssetFile('assets/test/test.zip');
        return this.load(zip, songRepository);
    }

    async load(zip: File, songRepository: SongRepository): Promise<Setlist> {
        const songArchive = await SongArchive.fromZip(zip);
        for (const song of songArchive) {
            const songEntry = await this.songEntryMapper.modelFromSong(song);
            songRepository.pushAll(songEntry);

            const recording = songEntry.recording;
            if (recording) {
                const audio = await song.audio;
                if (audio) {
                    this.sampleCacheService.setAudio(recording.name, async () => audio);
                }
            }
        }
        const setlist = Setlist.fromSongArchive(songArchive, songRepository)
        this.setlistRepository.push(setlist);
        console.log(`Setlist "${setlist.title}" initialisée`);
        return setlist;
    }

    songEntry$(activatedRoute: ActivatedRoute, songRepository: SongRepository): Observable<SongEntry> {
        return activatedRoute.params.pipe(
            switchMap(params => {
                const songName = params['songName']
                return songName ? songRepository.requireSongEntry(songName) : this.getDefaultSongEntry(songRepository);
            })
        )
    }

    private getDefaultSongEntry(songRepository: SongRepository): Promise<SongEntry> {
        return songRepository.requireSongEntry(DEFAULT_SONG);
    }
}
