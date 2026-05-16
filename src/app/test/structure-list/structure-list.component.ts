import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SongRepository} from "../../song/song-repository";
import {Structure} from "../../structure/structure";
import {NgForOf} from "@angular/common";
import {error} from "../../utils";
import {SongEntry} from "../../song/song-entry";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-structure-list',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl: './structure-list.component.html',
    styleUrl: './structure-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureListComponent {

    protected structure?: Structure;

    constructor(
        private readonly songRepository: SongRepository,
        activatedRoute: ActivatedRoute,
    ) {
        activatedRoute.params.subscribe(params => {
            const songName = params['songName']
            if (songName) error('Aucun titre')

            const songEntry = this.requireSongEntry(songName);
            this.structure = songEntry.structure;
        })
    }

    protected requireSongEntry(songName: string): SongEntry {
        return this.songRepository.requireSongEntry(songName)
    }

}
