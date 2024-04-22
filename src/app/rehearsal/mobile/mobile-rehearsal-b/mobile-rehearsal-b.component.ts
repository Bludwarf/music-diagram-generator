import { CommonModule, JsonPipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FretboardComponent } from "../../../fretboard/fretboard.component";
import { RythmBarComponent } from "../../../rythm-bar/rythm-bar.component";
import { PatternComponent } from "../../../structure/pattern/pattern.component";
import { SectionComponent } from "../../../structure/section/section.component";
import { ChordsGridComponent } from "../chords-grid/chords-grid.component";
import { MobileRehearsal } from "../mobile-rehearsal";
import { PartLineComponent } from "../part-line/part-line.component";
import { PartTabsComponent } from "../part-tabs/part-tabs.component";
import { SampleMapComponent } from "../sample-map/sample-map.component";
import { StructureMapComponent } from "../structure-map/structure-map.component";

@Component({
  selector: 'app-mobile-rehearsal-b',
  standalone: true,
  imports: [
    RythmBarComponent, JsonPipe, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent, StructureMapComponent, PartTabsComponent, PartLineComponent, SampleMapComponent, ChordsGridComponent,
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
