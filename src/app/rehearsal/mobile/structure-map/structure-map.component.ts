import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Structure} from "../../../structure/structure";
import {NgForOf} from "@angular/common";
import {PatternInStructure} from "../../../structure/pattern/pattern-in-structure";

@Component({
  selector: 'app-structure-map',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './structure-map.component.html',
  styleUrl: './structure-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructureMapComponent {
  @Input() structure!: Structure;
  @Input() timecode?: string;
  @Input() currentPatternInStructure: PatternInStructure | undefined;
  @Output() clickPatternInStructure = new EventEmitter<PatternInStructure>();

  onClickPatternInStructure(patternInStructure: PatternInStructure) {
    this.clickPatternInStructure.emit(patternInStructure);
  }

  getPatternColor(patternInStructure: PatternInStructure): string {
    return patternInStructure.structure.getPatternColor(patternInStructure).toString()
  }
}
