import {CommonModule} from "@angular/common";
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {ChordsGridComponent} from "../chords-grid/chords-grid.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {SampleMapComponent} from "../sample-map/sample-map.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SampleCacheService} from "../../../sample/samples-cache.service";
import {SongRepository} from "../../../song/song-repository";
import {ToneAdapter} from "../../../tonejs/tone-adapter";
import {SectionInStructure} from "../../../structure/section/section-in-structure";
import {PartInStructure} from "../../../structure/part/part-in-structure";

class CSSUnitValueClass {

    constructor(
        public value: number,
        public readonly unit: string,
    ) {
    }

}

@Component({
    selector: 'app-mobile-rehearsal-c',
    standalone: true,
    imports: [
        RythmBarComponent,
        CommonModule,
        FormsModule,
        FretboardComponent,
        StructureMapComponent,
        SampleMapComponent,
        ChordsGridComponent,
    ],
    templateUrl: './mobile-rehearsal-c.component.html',
    styleUrl: './mobile-rehearsal-c.component.scss',
})
export class MobileRehearsalCComponent extends MobileRehearsal implements OnInit, OnDestroy {

    widthPerBar = new CSSUnitValueClass(16, "px");

    @ViewChild('horizontalScroller')
    horizontalScroller?: ElementRef;

    @ViewChild('horizontalScrolledDiv')
    horizontalScrolledDiv?: ElementRef;

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
        super.onInit();

        this.currentPatternInStructure$.subscribe(currentPatternInStructure => {
            const structure = this.structure;
            const scroller = this.horizontalScroller?.nativeElement;
            const scrolledDiv = this.horizontalScrolledDiv?.nativeElement;
            if (currentPatternInStructure && structure && scroller && scrolledDiv) {
                const structureWidth = scrolledDiv.clientWidth;
                const widthPerBar = structureWidth / structure.durationInBars;
                const patternOffsetLeft = currentPatternInStructure.startPosition.bars * widthPerBar; // TODO on arrondi startPosition à la mesure
                if (scroller.scrollLeft !== patternOffsetLeft) {
                    const patternWidth = currentPatternInStructure.pattern.durationInBars * widthPerBar;
                    const viewWidth = scroller.clientWidth;
                    const patternIsFullyVisible = patternOffsetLeft + patternWidth <= scroller.scrollLeft + viewWidth;
                    if (!patternIsFullyVisible) {
                        scroller.scrollLeft = patternOffsetLeft;
                    }
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.onDestroy()
    }

    getPatternColor(patternInStructure: PatternInStructure): string {
        return patternInStructure.structure.getPatternColor(patternInStructure).toString()
    }

    get sectionsInStructure(): SectionInStructure[] {
        if (!this.structure) return [];
        return this.structure.partsInStructure.flatMap((partInStructure: PartInStructure) => partInStructure.sectionsInStructure);
    }

    get patternsInStructure(): PatternInStructure[] {
        return this.sectionsInStructure.flatMap((sectionInStructure: SectionInStructure) => sectionInStructure.patternsInStructure);
    }
}
