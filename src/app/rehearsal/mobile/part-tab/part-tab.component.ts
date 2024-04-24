import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {PartInStructure} from "../../../structure/part/part-in-structure";

@Component({
  selector: 'app-part-tab',
  standalone: true,
  imports: [],
  templateUrl: './part-tab.component.html',
  styleUrl: './part-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartTabComponent {
  @Input() partInStructure!: PartInStructure;
  @Input() currentPartInStructure?: PartInStructure;

  @HostBinding('class.active')
  get active(): boolean {
    return this.partInStructure === this.currentPartInStructure
  }

}
