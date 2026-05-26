import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {ChordsGridComponent} from "../chords-grid/chords-grid.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {SampleMapComponent} from "../sample-map/sample-map.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SampleCacheService} from "../../../sample/samples-cache.service";
import {ToneAdapter} from "../../../tonejs/tone-adapter";
import {SectionInStructure} from "../../../structure/section/section-in-structure";
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {TransportButtonComponent} from "../../../buttons/transport-button/transport-button.component";
import {SongEntry} from "../../../song/song-entry";
import {toObservable} from "@angular/core/rxjs-interop";

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
        TransportButtonComponent,
    ],
    templateUrl: './mobile-rehearsal-c.component.html',
    styleUrl: './mobile-rehearsal-c.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalCComponent extends MobileRehearsal implements OnInit, OnDestroy {

    songEntry = input.required<SongEntry>();

    widthPerBar = new CSSUnitValueClass(16, "px");

    @ViewChild('horizontalScroller')
    horizontalScroller?: ElementRef;

    @ViewChild('horizontalScrolledDiv')
    horizontalScrolledDiv?: ElementRef;

    constructor(
        toneAdapter: ToneAdapter,
        sampleCacheService: SampleCacheService,
    ) {
        super(toneAdapter, sampleCacheService)

        const currentPatternInStructure$ = toObservable(this.currentPatternInStructure)
        currentPatternInStructure$.subscribe(currentPatternInStructure => {
            const scroller = this.horizontalScroller?.nativeElement;
            const scrolledDiv = this.horizontalScrolledDiv?.nativeElement;
            if (scroller && scrolledDiv) {
                const structureWidth = scrolledDiv.clientWidth;
                const structure = this.structure();
                const widthPerBar = structureWidth / structure.durationInBars;
                const patternOffsetLeft = currentPatternInStructure.startPosition.bars * widthPerBar;
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

    ngOnInit() {
        super.onInit();
    }

    ngOnDestroy(): void {
        this.onDestroy()
    }

    getPatternColor(patternInStructure: PatternInStructure): string {
        return patternInStructure.structure.getPatternColor(patternInStructure).toString()
    }

    get sectionsInStructure(): SectionInStructure[] {
        const structure = this.structure();
        if (!structure) return [];
        return structure.partsInStructure.flatMap((partInStructure: PartInStructure) => partInStructure.sectionsInStructure);
    }

    get patternsInStructure(): PatternInStructure[] {
        return this.sectionsInStructure.flatMap((sectionInStructure: SectionInStructure) => sectionInStructure.patternsInStructure);
    }
}
