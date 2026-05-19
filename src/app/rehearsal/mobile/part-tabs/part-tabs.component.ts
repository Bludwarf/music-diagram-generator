import {NgForOf} from "@angular/common";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {Structure} from "../../../structure/structure";
import {PartTabComponent} from "../part-tab/part-tab.component";
import {PositionedElement} from "../../../time";

@Component({
    selector: 'app-part-tabs',
    standalone: true,
    imports: [
        NgForOf,
        PartTabComponent,

    ],
    templateUrl: './part-tabs.component.html',
    styleUrl: './part-tabs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartTabsComponent {
    @Input() structure!: Structure;
    @Input() currentPartInStructure?: PartInStructure;
    @Input() loopedElement?: PositionedElement;

    @Output() clickPartInStructure = new EventEmitter<PartInStructure>();

    onClickPartInStructure(partInStructure: PartInStructure) {
        this.clickPartInStructure.emit(partInStructure);
    }

}
