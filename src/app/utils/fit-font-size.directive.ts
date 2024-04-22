import { AfterViewInit, Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import { adjustFontSize } from './css-utils';

@Directive({
  selector: '[appFitFontSize]',
  standalone: true
})
export class FitFontSizeDirective implements AfterViewInit {

  @Input('appFitFontSize')
  container?: HTMLElement

  constructor(
    private readonly elementRef: ElementRef,
    private ngZone: NgZone,
  ) {
  }

  ngAfterViewInit(): void {
    this.adjustFontSize()
  }

  // Source : https://stackoverflow.com/a/35527852/1655155
  // Voir si l'autre solution est plus simple ou plus efficace
  // Le but est d'éviter de tomber dans une boucle de détection de changement, comme avec setTimeout ou fromEvent
  // TODO pour des raisons de perfs, on désactive pour le moment
  // @HostListener('window:resize')
  // onResize() {
  //   console.log('resize')
  //   this.adjustFontSize()
  // }

  private adjustFontSize() {
    if (this.container) {
      this.ngZone.run(() => {
        if (this.container) {
          adjustFontSize(this.elementRef.nativeElement, this.container)
        }
      })
    }
  }
}
