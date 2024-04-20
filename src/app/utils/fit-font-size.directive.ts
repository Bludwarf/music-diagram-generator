import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { adjustFontSize } from './css-utils';
import { fromEvent, tap, debounceTime } from 'rxjs';

@Directive({
  selector: '[appFitFontSize]',
  standalone: true
})
export class FitFontSizeDirective implements AfterViewInit {

  @Input('appFitFontSize')
  container?: HTMLElement

  constructor(
    private readonly elementRef: ElementRef,
  ) {
  }

  ngAfterViewInit(): void {
    this.adjustFontSize()
    this.detectChangesOnWindowResize();
  }

  // TODO à factoriser avec rythm-bar-beat-division
  private detectChangesOnWindowResize() {
    // TODO il suffit de souscrire pour déclencher une détection de changement ? : https://stackoverflow.com/questions/35527456/angular-window-resize-event
    fromEvent(window, 'resize').pipe(
      tap(() => console.log('window resize')),
      debounceTime(1000),
      tap(() => console.log('debounced window resize'))
    ).subscribe(() => {
      this.adjustFontSize()
    });
  }

  private adjustFontSize() {
    if (this.container) {
      adjustFontSize(this.elementRef.nativeElement, this.container)
    }
  }
}
