import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {StructureGridComponent} from "../structure-grid/structure-grid.component";
import {StructureInGrid} from "../structure-grid/StructureInGrid";
import {Pattern} from "../../structure/pattern/pattern";
import {ColorResolver} from "../../color";
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {SongInSetlist} from "../setlist-pages/setlist";
import {SongEntry} from "../../song/song-entry";
import {PageComponent} from "../page/page.component";

@Component({
    selector: 'app-structure-page',
    imports: [
        StructureGridComponent,
        PageComponent,
    ],
    templateUrl: './structure-page.component.html',
    styleUrl: './structure-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructurePageComponent implements OnChanges {

  @Input({required: true})
  song!: SongInSetlist;

  get songEntry(): SongEntry {
    return this.song.songEntry
  }

  get songName(): string {
    return this.song.songEntry.name
  }

  get version(): string | undefined {
    return this.song.songEntry.version
  }

  @Input()
  songTotalCount?: number;

  get structureInGrid(): StructureInGrid {
    return this.song.structureInGrid
  }

  private _colorResolver: ColorResolver | undefined;
  get colorResolver(): ColorResolver {
    this._colorResolver ??= new ColorResolver(this.structureInGrid.structure);
    return this._colorResolver;
  }

  // TODO faire une meilleure gestion de la liste des patterns
  patternsWithoutDuplicatedInitial: Pattern[] = [];
  firstPatternInStructureByInitial: Record<string, PatternInStructure> = {};

  ngOnChanges(): void {
    if (this.structureInGrid) {
      for (const patternInStructure of this.structureInGrid.structure.patternsInStructure) {
        const pattern = patternInStructure.pattern;
        if (!(pattern.initial in this.firstPatternInStructureByInitial)) {
          this.patternsWithoutDuplicatedInitial.push(pattern);
          this.firstPatternInStructureByInitial[pattern.initial] = patternInStructure;
        }
      }
    }
  }

  get title(): string {
    return this.songName;
  }

  getPatternColor(pattern: Pattern) {
    const firstPatternInStructure: PatternInStructure = this.getFirstPatternInStructure(pattern);
    return this.colorResolver.getPatternColor(firstPatternInStructure)
  }

  getFirstPatternInStructure(pattern: Pattern) {
    return this.firstPatternInStructureByInitial[pattern.initial];
  }

  round = Math.round
}
