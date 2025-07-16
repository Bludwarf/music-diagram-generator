import {StaveNote, StaveNoteStruct} from "vexflow";

export class CustomStaveNote extends StaveNote {
  onClickListener?: SvgListener<'click'>;

  constructor(noteStruct: StaveNoteStruct, noteStruct2?: CustomStaveNoteStruct) {
    super(noteStruct);
    this.onClickListener = noteStruct2?.onClickListener;
    // this.setLedgerLineStyle({
    //   lineWidth: 2
    // })
  }

  override draw() {
    super.draw();

    if (this.onClickListener) {
      const svgElement = this.getSVGElement();
      if (svgElement) {
        svgElement.addEventListener("click", this.onClickListener);
      }
    }
  }

  activate(): void {
    const svgElement = this.getSVGElement();
    if (svgElement) {
      svgElement.style.fill = 'red';
    }
  }

  deactivate(): void {
    const svgElement = this.getSVGElement();
    if (svgElement) {
      svgElement.style.fill = '';
    }
  }

}

export type CustomStaveNoteStruct = {
  onClickListener?: SvgListener<'click'>;
}

export type SvgListener<K extends keyof SVGElementEventMap> = (this: SVGElement, ev: SVGElementEventMap[K]) => any
