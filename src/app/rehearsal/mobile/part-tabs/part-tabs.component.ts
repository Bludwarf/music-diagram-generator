import { NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PartInStructure } from "../../../structure/part/part-in-structure";
import { SectionComponent } from "../../../structure/section/section.component";
import { Structure } from "../../../structure/structure";
import { SwipeDirective } from '../../../swipe.directive';
import { TimedElement } from '../../../time';
import { PartTabComponent } from "../part-tab/part-tab.component";

@Component({
  selector: 'app-part-tabs',
  standalone: true,
  imports: [
    SectionComponent,
    NgForOf,
    PartTabComponent,
    SwipeDirective,
  ],
  templateUrl: './part-tabs.component.html',
  styleUrl: './part-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartTabsComponent {
  @Input() structure!: Structure;
  @Input() currentPartInStructure?: PartInStructure;
  @Input() loopedElement?: TimedElement;

  @Output() clickPartInStructure = new EventEmitter<PartInStructure>();
  @Output() swipeDownPartInStructure = new EventEmitter<PartInStructure>();

  onClickPartInStructure(partInStructure: PartInStructure) {
    this.clickPartInStructure.emit(partInStructure);
  }

  onSwipeDownPartInStructure(partInStructure: PartInStructure): void {
    this.swipeDownPartInStructure.emit(partInStructure);
  }
}
