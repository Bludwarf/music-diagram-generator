import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SongRepository} from "../../song/song-repository";
import {StructurePageComponent} from "../structure-page/structure-page.component";
import {Setlist} from './setlist';
import {Title} from "@angular/platform-browser";
import {SetlistTocComponent} from "../setlist-toc/setlist-toc.component";
import {ActivatedRoute, Router} from "@angular/router";
import {error} from "../../utils";
import {SetlistRepository} from "./setlist-repository";

@Component({
    selector: 'app-setlist-pages',
    standalone: true,
    imports: [
        StructurePageComponent,
        SetlistTocComponent
    ],
    templateUrl: './setlist-pages.component.html',
    styleUrl: './setlist-pages.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetlistPagesComponent {
    protected setlist?: Setlist;

    constructor(
        readonly songRepository: SongRepository,
        readonly title: Title,
        activatedRoute: ActivatedRoute,
        setlistRepository: SetlistRepository,
    ) {
        activatedRoute.queryParams.subscribe(params => {
            const title = params['title'];
            if (!title) {
                this.setlist = undefined;
                error(`Aucun titre de setlist reçu`);
            }
            this.setlist = setlistRepository.getByTitle(title);
        });

    }

}
