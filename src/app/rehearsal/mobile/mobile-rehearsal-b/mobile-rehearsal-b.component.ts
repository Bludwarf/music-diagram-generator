import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RythmBarComponent} from "../../../rythm-bar/rythm-bar.component";
import {CommonModule, JsonPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FretboardComponent} from "../../../fretboard/fretboard.component";
import {PatternComponent} from "../../../structure/pattern/pattern.component";
import {SectionComponent} from "../../../structure/section/section.component";
import {StructureMapComponent} from "../structure-map/structure-map.component";
import {MobileRehearsal} from "../mobile-rehearsal";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {PartTabsComponent} from "../part-tabs/part-tabs.component";
import {PartLineComponent} from "../part-line/part-line.component";
import {SampleMapComponent} from "../sample-map/sample-map.component";

@Component({
  selector: 'app-mobile-rehearsal-b',
  standalone: true,
  imports: [
    RythmBarComponent, JsonPipe, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent, StructureMapComponent, PartTabsComponent, PartLineComponent, SampleMapComponent
  ],
  templateUrl: './mobile-rehearsal-b.component.html',
  styleUrl: './mobile-rehearsal-b.component.scss'
})
export class MobileRehearsalBComponent extends MobileRehearsal implements OnInit {

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
  ) {
    super(changeDetectorRef, activatedRoute, title)
  }

  ngOnInit() {
    const entry = this.requireSongEntry();
    this.structure = entry.structure
    this.recording = entry.recording

    this.mockInit();
  }

  private mockInit() {
  }

  override async playSong(): Promise<void> {
    if (!this.sampleIsLoaded) {
      this.fileInput?.nativeElement.click();
      return;
    }
    await super.playSong();
  }
}
