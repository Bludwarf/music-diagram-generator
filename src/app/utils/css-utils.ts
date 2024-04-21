export function adjustFontSize(textElement: HTMLElement, container: HTMLElement): void {
    const currentFontSize: number = parseInt(window.getComputedStyle(textElement).fontSize);

    const tBCR = textElement.getBoundingClientRect();
    const tw = tBCR.width;
    const th = tBCR.height;
    if (!tw || !th) {
        console.warn('Text element has no size')
        return
    }

    const cBCR = container.getBoundingClientRect();
    const cw = cBCR.width;
    const ch = cBCR.height;

    // TODO prendre en compte les padding/margin

    const maxFontSize = Math.min(currentFontSize * cw/tw, currentFontSize * ch/th)
    // console.debug('adjustFontSize', {currentFontSize, tw, th, cw, ch, maxFontSize})

    textElement.style.fontSize = `${maxFontSize}px`
}
