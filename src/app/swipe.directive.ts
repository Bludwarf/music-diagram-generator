import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Source : https://stackoverflow.com/a/67553519/1655155
 */
@Directive({
  selector: '[swipeLeft],[swipeUp],[swipeRight],[swipeDown]',
  standalone: true
})
export class SwipeDirective {

  @Input() minimumSwipeDistance = 30
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeUp = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();
  @Output() swipeDown = new EventEmitter<void>();

  swipeCoord: Vector = new Vector(0, 0);
  swipeTime = new Date().getTime();

  constructor() { }

  @HostListener('touchstart', ['$event']) onSwipeStart($event: TouchEvent) {
    this.onSwipe($event, 'start');
  }

  @HostListener('touchend', ['$event']) onSwipeEnd($event: TouchEvent) {
    this.onSwipe($event, 'end');
  }

  onSwipe(e: TouchEvent, when: string) {
    this.swipe(e, when);
  }

  swipe(e: TouchEvent, when: string): void {

    const coord: Vector = new Vector(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction: Vector = new Vector(coord.x - this.swipeCoord.x, coord.y - this.swipeCoord.y)
      const duration = time - this.swipeTime;

      if (duration < 1000) {
        const maxDim = Math.max(direction.width, direction.height)

        if (maxDim > this.minimumSwipeDistance) {

          if (maxDim === direction.width) {
            if (direction.x < 0) {
              this.swipeLeft.emit();
            } else {
              this.swipeRight.emit();
            }
          } else {
            if (direction.y < 0) {
              this.swipeUp.emit();
            } else {
              this.swipeDown.emit();
            }
          }
        }
      }

    }
  }

}

class Vector {
  readonly width: number
  readonly height: number

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.width = Math.abs(x)
    this.height = Math.abs(y)
  }
}
