import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {VIEW_TYPES} from "../rehearsal/mobile/mobile-rehearsal";
import {getUploadedFile} from "../utils/file-utils";
import {SongRepository} from "../song/song-repository";
import {SongArchive, SongInArchive} from "../song/song-archive";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";
import {SampleCacheService} from "../sample/samples-cache.service";
import {warn} from "../utils";
import {Setlist} from "../test/setlist-pages/setlist";
import {SetlistRepository} from "../test/setlist-pages/setlist-repository";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit {

    private _setlist?: Setlist;

    protected readonly VIEW_TYPES = VIEW_TYPES;

    constructor(
        private readonly songRepository: SongRepository,
        private readonly songEntryParser: SongEntryMapper,
        private readonly sampleCacheService: SampleCacheService,
        private readonly setlistRepository: SetlistRepository,
        readonly title: Title,
    ) {
    }

    get setlist(): Setlist | undefined {
        return this._setlist;
    }

    set setlist(setlist: Setlist | undefined) {
        this._setlist = setlist;
        this.title.setTitle(setlist?.title ?? "Music Diagram Generator");
    }

    ngOnInit() {
        this.setlist = this.setlistRepository.lastPushed;
    }

    async uploadZip(event: Event): Promise<void> {
        const zip = getUploadedFile(event);
        if (!zip) return;

        const songArchive = await SongArchive.fromZip(zip);

        for (const song of songArchive) {
            await this.pushSong(song, this.songRepository, this.songEntryParser, this.sampleCacheService);
        }

        this.setlist = Setlist.fromSongArchive(songArchive, this.songRepository);
        this.setlistRepository.push(this.setlist);
    }

    async pushSong(song: SongInArchive, songRepository: SongRepository, songEntryParser: SongEntryMapper, sampleCacheService: SampleCacheService) {
        try {
            const structure = await song.structure;
            const recording = await song.recording;
            const songEntry = await songEntryParser.model(song.name, song.version, structure, recording);
            songRepository.pushAll(songEntry);

            if (recording) {
                const audio = await song.audio;
                if (audio) {
                    sampleCacheService.setAudio(recording.name, async () => audio);
                }
            }
        } catch (e) {
            warn(`Erreur lors de l'ajout du morceau "${song.name}"`, e);
        }
    }

}
