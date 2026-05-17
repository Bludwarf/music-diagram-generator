import {Component, isDevMode, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {ViewType} from "../rehearsal/mobile/mobile-rehearsal";
import {SongRepository} from "../song/song-repository";
import {Setlist} from "../setlist/setlist";
import {SetlistRepository} from "../setlist/setlist-repository";
import {Title} from "@angular/platform-browser";
import {SongArchiveLoader} from "../song/song-archive-loader.service";
import {getUploadedFile} from "../utils/file-utils";
import * as VERSION_INFO from "../../environments/version-info.json";

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit {

    private _setlist?: Setlist;

    protected readonly VIEW_TYPES: ViewType[] = [
        "B",
        "P-osmd",
    ];
    protected viewType: ViewType = "B";

    protected readonly testRoutes: readonly string[] = [
        "chords-grid",
        "structure-list",
        "create-zip",
    ]

    protected readonly isDevMode = isDevMode;

    constructor(
        private readonly songRepository: SongRepository,
        private readonly setlistRepository: SetlistRepository,
        private readonly songArchiveLoader: SongArchiveLoader,
        readonly title: Title,
    ) {
    }

    get setlist(): Setlist | undefined {
        return this._setlist;
    }

    set setlist(setlist: Setlist | undefined) {
        this._setlist = setlist;
        this.title.setTitle(setlist?.title ? "Setlist " + setlist.title : "Music Diagram Generator");
    }

    ngOnInit() {
        this.loadSetlist();
        const viewTypeFromState = history.state?.viewType;
        if (viewTypeFromState) {
            this.viewType = viewTypeFromState;
        }
    }

    async loadSetlist(): Promise<void> {
        this.setlist = this.setlistRepository.lastPushed;

        if (!this.setlist && isDevMode()) {
            this.setlist = await this.songArchiveLoader.getDefaultSetlist(this.songRepository);
        }
    }

    async uploadZip(event: Event): Promise<void> {
        const zip = getUploadedFile(event);
        if (!zip) return;

        this.setlist = await this.songArchiveLoader.load(zip, this.songRepository);
    }

    onViewTypeChange(): void {
        history.pushState({
            viewType: this.viewType
        }, "");
    }

    get revision(): string {
        return VERSION_INFO.revision;
    }

}
