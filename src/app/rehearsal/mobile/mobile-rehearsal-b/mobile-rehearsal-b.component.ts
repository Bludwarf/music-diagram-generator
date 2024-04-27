import { CommonModule, JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PatternInStructure } from "../../../structure/pattern/pattern-in-structure";
import { SampleCacheService } from "../../../sample/samples-cache.service";
import { error } from "../../../utils";

@Component({
  selector: 'app-mobile-rehearsal-b',
  standalone: true,
  imports: [
    RythmBarComponent, JsonPipe, CommonModule, FormsModule, FretboardComponent, PatternComponent, SectionComponent, StructureMapComponent, PartTabsComponent, PartLineComponent, SampleMapComponent, ChordsGridComponent,
  ],
  templateUrl: './mobile-rehearsal-b.component.html',
  styleUrl: './mobile-rehearsal-b.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalBComponent extends MobileRehearsal implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    title: Title,
    sampleCacheService: SampleCacheService,
  ) {
    super(changeDetectorRef, activatedRoute, title, sampleCacheService)
  }

  ngOnInit() {
    const entry = this.requireSongEntry();
    this.structure = entry.structure
    this.recording = entry.recording

    this.mockInit();
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  private mockInit() {
  }

  override async playSong(): Promise<void> {
    if (!this.sampleIsLoaded) {
      if (!this.recording) {
        error('Aucun enregistrement (Recording)')
      }

      const audioFile = this.sampleCacheService.get(this.recording.name)
      if (audioFile) {
        await this.playAudioFile(audioFile)
      } else {
        this.fileInput?.nativeElement.click();
      }
      return;
    }
    await super.playSong();
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return patternInStructure.structure.getPatternColor(patternInStructure).toString()
  }
}
