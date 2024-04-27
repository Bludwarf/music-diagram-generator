import { NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PartInStructure } from "../../../structure/part/part-in-structure";
import { PatternInStructure } from "../../../structure/pattern/pattern-in-structure";
import { SectionInStructure } from "../../../structure/section/section-in-structure";
import { SwipeDirective } from "../../../swipe.directive";
import { TimedElement } from "../../../time";

@Component({
  selector: 'app-part-line',
  standalone: true,
  imports: [
    NgForOf,
    SwipeDirective
  ],
  templateUrl: './part-line.component.html',
  styleUrl: './part-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartLineComponent {
  @Input() partInStructure!: PartInStructure;
  @Input() currentPatternInStructure?: PatternInStructure;
  @Input() currentSectionInStructure?: SectionInStructure
  @Input() loopedElement?: TimedElement;
  @Output() clickSectionInStructure = new EventEmitter<SectionInStructure>()
  @Output() clickPatternInStructure = new EventEmitter<PatternInStructure>()
  @Output() swipeDownPatternInStructure = new EventEmitter<PatternInStructure>()
  @Output() swipeDownSectionInStructure = new EventEmitter<SectionInStructure>()

  onClickSectionInStructure(sectionInStructure: SectionInStructure) {
    this.clickSectionInStructure.emit(sectionInStructure)
  }

  onClickPatternInStructure(patternInStructure: PatternInStructure) {
    this.clickPatternInStructure.emit(patternInStructure)
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return patternInStructure.structure.getPatternColor(patternInStructure).toString()
  }

  onSwipeDownPatternInStructure(patternInStructure: PatternInStructure): void {
    this.swipeDownPatternInStructure.emit(patternInStructure)
  }

  onSwipeDownSectionInStructure(sectionInStructure: SectionInStructure): void {
    this.swipeDownSectionInStructure.emit(sectionInStructure)
  }
}
