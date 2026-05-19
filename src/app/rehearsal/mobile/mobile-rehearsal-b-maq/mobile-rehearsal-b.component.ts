import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TransportButtonComponent} from "../../../buttons/transport-button/transport-button.component";

@Component({
    selector: 'app-mobile-rehearsal-b-maq',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TransportButtonComponent
    ],
    templateUrl: './mobile-rehearsal-b.component.html',
    styleUrl: './mobile-rehearsal-b.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRehearsalBMaqComponent {

}
