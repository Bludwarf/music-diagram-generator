import {NgForOf, NgIf} from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {BaseColor as Color} from '../../../color';
import {BarNumber0Indexed, Chords, Key} from "../../../notes";
import {sequence} from "../../../utils";
import {FitFontSizeDirective} from '../../../utils/fit-font-size.directive';

@Component({
    selector: 'app-chords-grid',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FitFontSizeDirective,
    ],
    templateUrl: './chords-grid.component.html',
    styleUrl: './chords-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordsGridComponent implements AfterViewInit {
    @Input() chords!: Chords;
    @Input() currentBar?: BarNumber0Indexed;
    @Input() currentBarIsLooped = false;
    @Input() key?: Key

    @HostBinding('style.border-color')
    @Input()
    borderColor?: Color

    @Output() clickBar = new EventEmitter<BarNumber0Indexed>();
    protected readonly sequence = sequence;

    protected barMinHeight = 0;

    @ViewChildren(FitFontSizeDirective) fitFontSizeDirectives?: QueryList<FitFontSizeDirective>;

    constructor(
        private readonly host: ElementRef,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    isCurrentBar(bar: BarNumber0Indexed): boolean {
        return bar === this.currentBar
    }

    onClickBar(bar: BarNumber0Indexed) {
        this.currentBar = bar
        this.clickBar.emit(bar)
    }

    ngAfterViewInit(): void {
        this.barMinHeight = this.host.nativeElement.clientWidth / 4;
        this.changeDetectorRef.detectChanges();
        if (this.fitFontSizeDirectives) {
            for (const fitFontSizeDirective of this.fitFontSizeDirectives) {
                fitFontSizeDirective.adjustFontSize();
            }
        }
    }
}
