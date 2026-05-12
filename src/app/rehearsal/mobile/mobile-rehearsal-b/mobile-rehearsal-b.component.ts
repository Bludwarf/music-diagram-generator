import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
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
import {SongRepository} from "../../../song/song-repository";
import {ToneAdapter} from "../../../tonejs/tone-adapter";

@Component({
    selector: 'app-mobile-rehearsal-b',
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
    ],
    templateUrl: './mobile-rehearsal-b.component.html',
    styleUrl: './mobile-rehearsal-b.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileRehearsalBComponent extends MobileRehearsal implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  override fileInput?: ElementRef<HTMLInputElement>;

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
    this.mockInit();
  }

  ngOnDestroy(): void {
    this.onDestroy()
  }

  private mockInit() {
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return patternInStructure.structure.getPatternColor(patternInStructure).toString()
  }
}
