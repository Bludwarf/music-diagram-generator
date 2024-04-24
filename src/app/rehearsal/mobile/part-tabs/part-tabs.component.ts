import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {Structure} from "../../../structure/structure";
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {SectionComponent} from "../../../structure/section/section.component";
import {NgForOf} from "@angular/common";
import {PartTabComponent} from "../part-tab/part-tab.component";

@Component({
  selector: 'app-part-tabs',
  standalone: true,
  imports: [
    SectionComponent,
    NgForOf,
    PartTabComponent
  ],
  templateUrl: './part-tabs.component.html',
  styleUrl: './part-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartTabsComponent {
  @Input() structure!: Structure;
  @Input() currentPartInStructure?: PartInStructure;

  @Output() clickPartInStructure = new EventEmitter<PartInStructure>();

  onClickPartInStructure(partInStructure: PartInStructure) {
    this.clickPartInStructure.emit(partInStructure);
  }
}
