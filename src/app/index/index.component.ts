import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {VIEW_TYPES} from "../rehearsal/mobile/mobile-rehearsal";
import {getUploadedFile} from "../utils/file-utils";
import {SongRepository} from "../song/song-repository";
import {SongArchive} from "../song/song-archive";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";

@Component({
    selector: 'app-index',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss'
})
export class IndexComponent {

    playlist: string[] = [
        'Le jour (le phare)',
        'La femme dragon',
        'Noyer le silence',
        'La 4L',
        'Surcouf',
        'Le résistant',
        'Solitude',
        'Petit Papillon',
        'Nuages blancs',
        'Elle rêve à quoi',
        'Rockollection',
        'Tout foufou',
        'Happy',
        'The Sims - If You Really See Eurydice'
    ]

    protected readonly VIEW_TYPES = VIEW_TYPES;

    constructor(
        private readonly songRepository: SongRepository,
        private readonly songEntryParser: SongEntryMapper,
        private readonly router: Router,
    ) {
    }

    async uploadZip(event: Event): Promise<void> {
        const zip = getUploadedFile(event);
        if (!zip) return;

        const songArchive = await SongArchive.fromZip(zip);

        await songArchive.pushSongsTo(this.songRepository, this.songEntryParser);
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
