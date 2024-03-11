import { Component, EventEmitter, Output } from '@angular/core';
import { PatternComponent } from './pattern/pattern.component';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [PatternComponent],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {

  @Output()
  clickPattern = new EventEmitter<string>();


  onClickPattern(pattern: string): void {
    this.clickPattern.emit(pattern);
  }
}
