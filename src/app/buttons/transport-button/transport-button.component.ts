import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgIcon, provideIcons} from "@ng-icons/core";
import {bootstrapPauseFill, bootstrapPlayFill, bootstrapTools} from "@ng-icons/bootstrap-icons";
import {error} from "../../utils";

export type IconName = 'play' | 'pause' | 'tools';

@Component({
    selector: 'app-transport-button',
    standalone: true,
    imports: [
        NgIcon
    ],
    providers: [provideIcons({bootstrapPlayFill, bootstrapPauseFill, bootstrapTools})],
    templateUrl: './transport-button.component.html',
    styleUrl: './transport-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportButtonComponent {
    disabled = input(false);
    icon = input.required<IconName>()

    ngIconName = computed(() => {
        const name = this.icon();
        switch (name) {
            // TODO typage du retour
            case "play":
                return "bootstrapPlayFill";
            case "pause":
                return "bootstrapPauseFill";
            case "tools":
                return "bootstrapTools";
        }
        error(`Icône inconnue : ${name}`);
    })
}
