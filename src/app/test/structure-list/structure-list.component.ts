import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Structure} from "../../structure/structure";
import {SongRepository} from "../../song/song-repository";
import {SongArchiveLoader} from "../../song/song-archive-loader.service";

@Component({
    selector: 'app-structure-list',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl: './structure-list.component.html',
    styleUrl: './structure-list.component.scss',
})
export class StructureListComponent {

    protected structure?: Structure;

    constructor(
        private readonly songArchiveLoader: SongArchiveLoader,
        songRepository: SongRepository,
        activatedRoute: ActivatedRoute,
    ) {
        const songEntry$ = this.songArchiveLoader.songEntry$(activatedRoute, songRepository);
        songEntry$.subscribe(songEntry => {
            this.structure = songEntry.structure;
        });
    }

}
