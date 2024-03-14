import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatternComponent } from './pattern/pattern.component';
import { Structure } from './structure';
import { CommonModule } from '@angular/common';
import { PatternInStructure } from './pattern/pattern-in-structure';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [PatternComponent, CommonModule],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {

  @Input()
  structure?: Structure;

  @Input()
  currentPatternInStructure?: PatternInStructure;

  @Output()
  clickPatternInStructure = new EventEmitter<PatternInStructure>();


  onClickPatternInStructure(patternInStructure: PatternInStructure): void {
    this.clickPatternInStructure.emit(patternInStructure);
  }
}
