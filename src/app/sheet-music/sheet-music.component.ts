// Source : https://github.com/imagicbell/piano-app/blob/master/src/features/musicSheet/index.js

import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Cursor, DrawingParametersEnum, OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import {Position} from "../time";

@Component({
    selector: 'app-sheet-music',
    imports: [],
    templateUrl: './sheet-music.component.html',
    styleUrl: './sheet-music.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetMusicComponent implements AfterViewInit {

  @ViewChild('div')
  divRef?: ElementRef<HTMLDivElement>;

  private _content?: string

  @Input({required: true})
  set musicXmlContent(content: string) {
    this._content = content;
    this.renderIfReady();
  }

  private measureNumber?: number;

  @Input()
  set position(position: Position) {
    this.setPosition(position);
  }

  private async setPosition(position: Position) {
    const measureNumber = position.bars + 1;
    if (this.measureNumber !== measureNumber) {
      this.measureNumber = measureNumber
      await this.renderIfReady()
    }

    const cursor = this.osmd?.cursor;
    if (measureNumber && cursor) {
      const beatsCount = cursor.Iterator.CurrentMeasure.ActiveTimeSignature.Denominator;
      const realValue = position.beats / beatsCount + position.sixteenths / beatsCount / 4 // TODO /4 qq soit la signature ?
      this.setCursorPosition(cursor, measureNumber, realValue);
      cursor.show();
    }
  }

  ngAfterViewInit() {
    this.renderIfReady();
  }

  private async renderIfReady() {
    const content = this._content;
    const measureNumber = this.measureNumber;
    const div = this.divRef?.nativeElement;
    if (content && measureNumber && div) {
      await this.render(content, measureNumber, div)
    }
  }

  private async render(content: string, measureNumber: number, div: HTMLDivElement): Promise<void> {
    console.log('Rendering measure ' + measureNumber)
    const osmd = await this.getOrLoadOsmd(div, content);
    osmd.setOptions({
      drawFromMeasureNumber: measureNumber,
      drawUpToMeasureNumber: measureNumber,
    })
    osmd.render()
  }

  // TODO très moche ! => pas mieux ?
  private setCursorPosition(cursor: Cursor, measureNumber: number, realValue: number) {

    cursor.CursorOptions.follow

    // console.log('setCursorPosition', measureNumber, realValue);
    const it = cursor.Iterator;
    while (it.CurrentMeasure.MeasureNumber !== measureNumber) {
      const measureNumberBeforeMove = it.CurrentMeasure.MeasureNumber;
      // console.log('Measure', it.CurrentMeasure.MeasureNumber);
      if (it.CurrentMeasure.MeasureNumber < measureNumber) {
        cursor.nextMeasure()
      } else {
        cursor.previousMeasure()
      }
      if (it.CurrentMeasure.MeasureNumber === measureNumberBeforeMove) {
        console.error('Mesure inchangée') // FIXME
        return;
      }
    }

    let movedDirectionWasNext: boolean | undefined;
    while (it.CurrentRelativeInMeasureTimestamp.RealValue !== realValue) {
      const realValueBeforeMove = it.CurrentRelativeInMeasureTimestamp.RealValue;
      // console.log('RealValue', it.CurrentRelativeInMeasureTimestamp.RealValue);

      if (it.CurrentRelativeInMeasureTimestamp.RealValue < realValue) {
        it.moveToNext()

        if (it.CurrentRelativeInMeasureTimestamp.RealValue === 0) {
          // console.error('On a dépassé la realValue max ' + realValueBeforeMove)
          it.moveToPrevious()
          break;
        }

        if (movedDirectionWasNext === undefined) {
          movedDirectionWasNext = true;
        } else if (!movedDirectionWasNext) {
          // console.warn('Cannot moveToNext')
          it.moveToPrevious()
          break;
        }
      } else {
        it.moveToPrevious()
        if (movedDirectionWasNext === undefined) {
          movedDirectionWasNext = false;
        } else if (movedDirectionWasNext) {
          // console.warn('Cannot moveToPrevious')
          // it.moveToNext() : on arrondit au temps précédent pour se positionner au même endroit qq soit le sens
          break;
        }
      }
    }

    cursor.show()
  }

  private osmd?: OpenSheetMusicDisplay;

  private async getOrLoadOsmd(div: HTMLDivElement, content: string) {
    this.osmd ??= await this.loadOsmd(div, content);
    return this.osmd
  }

  private async loadOsmd(div: HTMLDivElement, content: string) {
    console.log("Loading OSMD");
    const osmd = new OpenSheetMusicDisplay(div, {
      autoResize: true,
      disableCursor: false,
      drawComposer: false,
      drawCredits: false,
      drawingParameters: DrawingParametersEnum.compact,
      drawMetronomeMarks: false,
      drawPartNames: false,
      drawSubtitle: false,
      drawTitle: false,
    });

    if (!osmd) {
      throw new Error('OSMD not loaded');
    }

    await osmd.load(content);

    console.log("OSMD load OK");
    this.osmd = osmd;
    return osmd;
  }

}
