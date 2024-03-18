import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PatternComponent} from './pattern/pattern.component';
import {Structure} from './structure';
import {CommonModule} from '@angular/common';
import {PatternInStructure} from './pattern/pattern-in-structure';
import {SectionComponent} from "./section/section.component";
import {SectionInStructure} from "./section/section-in-structure";

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [PatternComponent, CommonModule, SectionComponent],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {

  @Input()
  structure?: Structure;

  @Input()
  currentSectionInStructure?: SectionInStructure;

  @Input()
  currentPatternInStructure?: PatternInStructure;

  @Input()
  currentSectionInStructureRelativeTimecode?: string;

  @Output()
  clickSectionInStructure = new EventEmitter<SectionInStructure>();

  @Output()
  clickPatternInStructure = new EventEmitter<PatternInStructure>();


  onClickPatternInStructure(patternInStructure: PatternInStructure): void {
    this.clickPatternInStructure.emit(patternInStructure);
  }

  onClickSectionInStructure(sectionInStructure: SectionInStructure) {
    this.clickSectionInStructure.emit(sectionInStructure);
  }
}
