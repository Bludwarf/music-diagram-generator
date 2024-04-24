import { NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { BaseColor as Color } from '../../../color';
import { BarNumber0Indexed, Chords, Key } from "../../../notes";
import { sequence } from "../../../utils";
import { FitFontSizeDirective } from '../../../utils/fit-font-size.directive';

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
export class ChordsGridComponent {
  @Input() chords!: Chords;
  @Input() currentBar?: BarNumber0Indexed;
  @Input() key?: Key

  @HostBinding('style.border-color')
  @Input()
  borderColor?: Color

  @Output() clickBar = new EventEmitter<BarNumber0Indexed>();
  protected readonly sequence = sequence;

  isCurrentBar(bar: BarNumber0Indexed): boolean {
    return bar === this.currentBar
  }

  onClickBar(bar: BarNumber0Indexed) {
    this.currentBar = bar
    this.clickBar.emit(bar)
  }
}
