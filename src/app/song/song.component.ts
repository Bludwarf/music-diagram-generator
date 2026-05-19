import {Component} from '@angular/core';
import {MobileRehearsalAComponent} from "../rehearsal/mobile/mobile-rehearsal-a/mobile-rehearsal-a.component";
import {MobileRehearsalBComponent} from "../rehearsal/mobile/mobile-rehearsal-b/mobile-rehearsal-b.component";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {MobileRehearsalBMaqComponent} from "../rehearsal/mobile/mobile-rehearsal-b-maq/mobile-rehearsal-b.component";
import {MobileRehearsalPComponent} from "../rehearsal/mobile/mobile-rehearsal-p/mobile-rehearsal-p.component";
import {
    MobileRehearsalPOsmdComponent
} from "../rehearsal/mobile/mobile-rehearsal-p-osmd/mobile-rehearsal-p-osmd.component";
import {ViewType} from "../rehearsal/mobile/mobile-rehearsal";
import {MobileRehearsalCComponent} from "../rehearsal/mobile/mobile-rehearsal-c/mobile-rehearsal-c.component";

@Component({
    selector: 'app-song',
    standalone: true,
    imports: [
        MobileRehearsalAComponent,
        MobileRehearsalBComponent,
        NgIf,
        MobileRehearsalBMaqComponent,
        MobileRehearsalPComponent,
        MobileRehearsalPOsmdComponent,
        MobileRehearsalCComponent,
    ],
    templateUrl: './song.component.html',
    styleUrl: './song.component.scss',
})
export class SongComponent {

    view: ViewType = 'B'

    constructor(
        activatedRoute: ActivatedRoute,
    ) {
        activatedRoute.queryParams.subscribe(queryParams => {
            const view = queryParams['view']
            if (view) {
                this.view = view
            }
        })
    }
}
