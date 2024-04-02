import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {NgForOf} from "@angular/common";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";
import {SectionInStructure} from "../../../structure/section/section-in-structure";

@Component({
  selector: 'app-part-line',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './part-line.component.html',
  styleUrl: './part-line.component.scss'
})
export class PartLineComponent {
  @Input() partInStructure!: PartInStructure;
  @Input() currentPatternInStructure?: PatternInStructure;
  @Input() currentSectionInStructure?: SectionInStructure
  @Output() clickSectionInStructure = new EventEmitter<SectionInStructure>()
  @Output() clickPatternInStructure = new EventEmitter<PatternInStructure>()

  onClickSectionInStructure(sectionInStructure: SectionInStructure) {
    this.clickSectionInStructure.emit(sectionInStructure)
  }

  onClickPatternInStructure(patternInStructure: PatternInStructure) {
    this.clickPatternInStructure.emit(patternInStructure)
  }
}
