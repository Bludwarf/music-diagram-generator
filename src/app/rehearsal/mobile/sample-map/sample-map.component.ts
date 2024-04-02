import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sample-map',
  standalone: true,
  imports: [],
  templateUrl: './sample-map.component.html',
  styleUrl: './sample-map.component.scss'
})
export class SampleMapComponent {
  @Input() transportSeconds?: number

  get timecode(): string | undefined {
    if (!this.transportSeconds) {
      return undefined;
    }
    const minutes = Math.floor(this.transportSeconds / 60)
    const seconds = Math.floor(this.transportSeconds % 60)
    const secondsString = (seconds < 10 ? '0' : '') + seconds
    return `${minutes}:${secondsString}`
  }
}
