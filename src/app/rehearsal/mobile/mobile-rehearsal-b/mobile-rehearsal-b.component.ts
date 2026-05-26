import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {ChordsGridComponent} from "../chords-grid/chords-grid.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {PartLineComponent} from "../part-line/part-line.component";
import {PartTabsComponent} from "../part-tabs/part-tabs.component";
import {SampleMapComponent} from "../sample-map/sample-map.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SampleCacheService} from "../../../sample/samples-cache.service";
import {ToneAdapter} from "../../../tonejs/tone-adapter";
import {TransportButtonComponent} from "../../../buttons/transport-button/transport-button.component";
import {SongEntry} from "../../../song/song-entry";

@Component({
    selector: 'app-mobile-rehearsal-b',
    standalone: true,
    imports: [
        RythmBarComponent,
        CommonModule,
        FormsModule,
        FretboardComponent,
        StructureMapComponent,
        PartTabsComponent,
        PartLineComponent,
        SampleMapComponent,
        ChordsGridComponent,
        TransportButtonComponent,
    ],
    templateUrl: './mobile-rehearsal-b.component.html',
    styleUrl: './mobile-rehearsal-b.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalBComponent extends MobileRehearsal implements OnInit, OnDestroy {

    songEntry = input.required<SongEntry>();

    @ViewChild('fileInput')
    override fileInput?: ElementRef<HTMLInputElement>;

    constructor(
        toneAdapter: ToneAdapter,
        sampleCacheService: SampleCacheService,
    ) {
        super(toneAdapter, sampleCacheService)
    }

    ngOnInit() {
        super.onInit();
    }

    ngOnDestroy(): void {
        this.onDestroy()
    }

    getPatternColor(patternInStructure: PatternInStructure): string {
        return patternInStructure.structure.getPatternColor(patternInStructure).toString()
    }
}
