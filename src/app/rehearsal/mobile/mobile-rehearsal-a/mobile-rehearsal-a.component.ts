import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-mobile-rehearsal-a',
  standalone: true,
  imports: [
    RythmBarComponent, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent
  ],
  templateUrl: './mobile-rehearsal-a.component.html',
  styleUrl: './mobile-rehearsal-a.component.scss'
})
export class MobileRehearsalAComponent extends MobileRehearsal implements OnInit {

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
    sampleCacheService: SampleCacheService,
    songRepository: SongRepository,
  ) {
    super(changeDetectorRef, activatedRoute, title, sampleCacheService, songRepository)
  }

  ngOnInit() {
    this.onInit()
  }
}
