import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'app-page',
    standalone: true,
    imports: [],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent {
    @Input()
    title?: string;
}
