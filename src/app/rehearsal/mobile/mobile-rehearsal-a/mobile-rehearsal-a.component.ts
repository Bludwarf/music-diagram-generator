import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {PatternComponent} from "../../../structure/pattern/pattern.component";
import {SectionComponent} from "../../../structure/section/section.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {SampleCacheService} from '../../../sample/samples-cache.service';
import {SongRepository} from '../../../song/song-repository';
import {ToneAdapter} from "../../../tonejs/tone-adapter";
import {TransportButtonComponent} from "../../../buttons/transport-button/transport-button.component";

@Component({
    selector: 'app-mobile-rehearsal-a',
    standalone: true,
    imports: [
        RythmBarComponent, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent, TransportButtonComponent
    ],
    templateUrl: './mobile-rehearsal-a.component.html',
    styleUrl: './mobile-rehearsal-a.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalAComponent extends MobileRehearsal implements OnInit {

    constructor(
        toneAdapter: ToneAdapter,
        activatedRoute: ActivatedRoute,
        title: Title,
        sampleCacheService: SampleCacheService,
        songRepository: SongRepository,
    ) {
        super(toneAdapter, activatedRoute, title, sampleCacheService, songRepository)
    }

    ngOnInit() {
        this.onInit()
    }
}
