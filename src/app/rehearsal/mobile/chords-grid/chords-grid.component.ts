import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BarNumber0Indexed, Chords} from "../../../notes";
import {NgForOf, NgIf} from "@angular/common";
import {sequence} from "../../../utils";
import {Time} from "../../../time";

@Component({
  selector: 'app-chords-grid',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './chords-grid.component.html',
  styleUrl: './chords-grid.component.scss'
})
export class ChordsGridComponent {
  @Input() chords!: Chords;
  @Input() currentBar?: BarNumber0Indexed;
  @Output() clickBar = new EventEmitter<BarNumber0Indexed>();
  protected readonly sequence = sequence;

  isCurrentBar(bar: BarNumber0Indexed): boolean {
    return bar === this.currentBar
  }

  onClickBar(bar: BarNumber0Indexed) {
    this.clickBar.emit(bar)
  }
}