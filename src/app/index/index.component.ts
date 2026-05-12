import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {VIEW_TYPES} from "../rehearsal/mobile/mobile-rehearsal";
import {getUploadedFile} from "../utils/file-utils";
import {SongRepository} from "../song/song-repository";
import {SongArchive} from "../song/song-archive";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";
import {SampleCacheService} from "../sample/samples-cache.service";

@Component({
    selector: 'app-index',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss'
})
export class IndexComponent {

    get playlist(): readonly string[] {
        return this.songRepository.songNames;
    }

    protected readonly VIEW_TYPES = VIEW_TYPES;

    constructor(
        private readonly songRepository: SongRepository,
        private readonly songEntryParser: SongEntryMapper,
        private readonly router: Router,
        private readonly sampleCacheService: SampleCacheService,
    ) {
    }

    async uploadZip(event: Event): Promise<void> {
        const zip = getUploadedFile(event);
        if (!zip) return;

        const songArchive = await SongArchive.fromZip(zip);

        await songArchive.pushSongsTo(this.songRepository, this.songEntryParser);
        await songArchive.setAudioTo(this.sampleCacheService);
    }

    async openSong(songName: string): Promise<void> {
        await this.router.navigate(
            ['morceaux', songName],
            {
                queryParams: {
                    view: "P-osmd",
                }
            }
        );
    }
}
