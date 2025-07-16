import {Stave, StaveOptions} from "vexflow";
import {sequence} from "../utils";
import {VoiceTime} from "vexflow/build/types/src/voice";

export class BeatsStave extends Stave {

  constructor(x: number, y: number, width: number, options?: StaveOptions) {
    super(x, y, width, options);
    this.setX(0);
    this.setNoteStartX(0);
  }

  override draw() {
    const ctx = this.checkContext();

    const voiceTime: VoiceTime = {
      numBeats: 4,
      beatValue: 4,
    }
    const upBeatValue = voiceTime.beatValue / 2;
    const count = voiceTime.numBeats * voiceTime.beatValue;
    const beatWidth = this.width / count;
    ctx.openGroup('stave-beats');
    sequence(count).forEach(i => {
      let beatType: BeatType | undefined;
      if (i % voiceTime.beatValue === 0) {
        beatType = 'down';
      }
      if (i % voiceTime.beatValue === upBeatValue) {
        beatType = 'up';
      }
      if (beatType) {
        this.drawBeat(beatWidth * i + this.x, beatWidth, beatType);
      }
    });
    ctx.closeGroup();

    super.draw();
  }

  private drawBeat(x: number, beatWidth: number, type: BeatType) {
    const ctx = this.checkContext();

    const lineWidth = this.getStyle().lineWidth ?? 1;
    const lineWidthCorrection = lineWidth % 2 === 0 ? 0 : 0.5;

    const left = x;
    const middle = left + beatWidth / 2;
    const right = left + beatWidth;

    const above = this.getYForLine(-1) + lineWidthCorrection;
    const topLine = this.getYForLine(0) + lineWidthCorrection;
    const bottomLine = this.getYForLine(this.getNumLines() - 1) + lineWidthCorrection;
    const below = this.getYForLine(this.getNumLines()) + lineWidthCorrection;

    ctx.beginPath();
    ctx.moveTo(left, topLine);
    ctx.lineTo(left, bottomLine);
    if (type === 'down') {
      ctx.lineTo(middle, below);
    }
    ctx.lineTo(right, bottomLine);
    ctx.lineTo(right, topLine);
    if (type === 'up') {
      ctx.lineTo(middle, above);
    }
    ctx.fill({
      fill: type === 'down' ? '#DDD' : '#EEE',
      stroke: 'none',
    });
  }
}

type BeatType = 'down' | 'up';
