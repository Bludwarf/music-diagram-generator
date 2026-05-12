import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {sequence} from "../../utils";
import {NgForOf, NgIf} from "@angular/common";
import {PartInGrid, SectionInGrid, StructureInGrid} from "./StructureInGrid";
import {PatternInStructure} from "../../structure/pattern/pattern-in-structure";
import {ColorResolver} from "../../color";
import {SectionInStructure} from "../../structure/section/section-in-structure";

@Component({
    selector: 'app-structure-grid',
    imports: [
        NgForOf,
        NgIf
    ],
    templateUrl: './structure-grid.component.html',
    styleUrl: './structure-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureGridComponent {

  @Input({required: true})
  structureInGrid!: StructureInGrid;

  @Input({required: true})
  colorResolver!: ColorResolver;

  getSectionColor(sectionInStructure: SectionInStructure) {
    if (sectionInStructure.section.color) {
      return sectionInStructure.section.color
    }
    const firstPattern = sectionInStructure.patternsInStructure[0];
    return this.getPatternColor(firstPattern);
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return this.colorResolver.resolvePatternColor(patternInStructure).toString()
  }

  protected readonly sequence = sequence;

  isFirstPatternInSection(patternInStructure: PatternInStructure, sectionInGrid: SectionInGrid): boolean {
    return sectionInGrid.sectionInStructure.patternsInStructure.indexOf(patternInStructure) === 0;
  }

  isLastPatternInSection(patternInStructure: PatternInStructure, sectionInGrid: SectionInGrid): boolean {
    const patternInStructures = sectionInGrid.sectionInStructure.patternsInStructure;
    return patternInStructures.indexOf(patternInStructure) === patternInStructures.length - 1;
  }

  isFirstPatternInPart(patternInStructure: PatternInStructure, partInGrid: PartInGrid): boolean {
    const firstSection = partInGrid.sectionsInGrid[0];
    return this.isFirstPatternInSection(patternInStructure, firstSection);
  }

  isLastPatternInPart(patternInStructure: PatternInStructure, partInGrid: PartInGrid): boolean {
    const lastSection = partInGrid.sectionsInGrid[partInGrid.sectionsInGrid.length - 1];
    return this.isLastPatternInSection(patternInStructure, lastSection);
  }
}
