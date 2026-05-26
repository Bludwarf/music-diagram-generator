import {Component} from '@angular/core';
import {MobileRehearsalAComponent} from "../rehearsal/mobile/mobile-rehearsal-a/mobile-rehearsal-a.component";
import {MobileRehearsalBComponent} from "../rehearsal/mobile/mobile-rehearsal-b/mobile-rehearsal-b.component";
import {ActivatedRoute} from "@angular/router";
import {MobileRehearsalBMaqComponent} from "../rehearsal/mobile/mobile-rehearsal-b-maq/mobile-rehearsal-b.component";
import {MobileRehearsalPComponent} from "../rehearsal/mobile/mobile-rehearsal-p/mobile-rehearsal-p.component";
import {
    MobileRehearsalPOsmdComponent
} from "../rehearsal/mobile/mobile-rehearsal-p-osmd/mobile-rehearsal-p-osmd.component";
import {ViewType} from "../rehearsal/mobile/mobile-rehearsal";
import {MobileRehearsalCComponent} from "../rehearsal/mobile/mobile-rehearsal-c/mobile-rehearsal-c.component";
import {error} from "../utils";
import {Title} from "@angular/platform-browser";
import {SongEntry} from "./song-entry";
import {SongRepository} from "./song-repository";

@Component({
    selector: 'app-song',
    standalone: true,
    imports: [
        MobileRehearsalAComponent,
        MobileRehearsalBComponent,
        MobileRehearsalBMaqComponent,
        MobileRehearsalPComponent,
        MobileRehearsalPOsmdComponent,
        MobileRehearsalCComponent,
    ],
    templateUrl: './song.component.html',
    styleUrl: './song.component.scss',
})
export class SongComponent {

    songEntry?: SongEntry
    view: ViewType = 'B'

    constructor(
        activatedRoute: ActivatedRoute,
        title: Title,
        songRepository: SongRepository,
    ) {
        activatedRoute.params.subscribe(async params => {
            const songName = params['songName']
            if (songName) {
                title.setTitle(songName)

                try {
                    this.songEntry = await songRepository.requireSongEntry(songName);
                } catch (e) {
                    history.back();
                    throw e;
                }
            } else {
                error('Aucun titre de morceau à charger')
            }
        })
        activatedRoute.queryParams.subscribe(queryParams => {
            const view = queryParams['view']
            if (view) {
                this.view = view
            }
        })
    }
}
