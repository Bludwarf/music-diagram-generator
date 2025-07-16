import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Input, Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {MetricsDefaults, RenderContext, Renderer, Voice} from "vexflow";
import {BeatsStave} from "../beats-stave";
import {BeatsFormatter} from "../beats-formatter";
import {NgIf} from "@angular/common";

const WIDTH = 366; // TODO 100vw possible ?
const HEIGHT = 125;
const STAVE_X = 0;
const STAVE_Y = 20;

@Component({
  selector: 'app-stave',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './stave.component.html',
  styleUrl: './stave.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaveComponent implements AfterViewInit {

  @ViewChild('output')
  div?: ElementRef<HTMLDivElement>;

  private _voices!: Voice[];

  get voices(): Voice[] {
    return this._voices;
  }

  @Input({required: true})
  set voices(voices: Voice[]) {
    this._voices = voices;

    if (this.context) {
      this.clear();
      if (voices && voices.length) {
        this.initv5Grid();
        this.drawVoices(voices, this.stave!!, this.context!!)
        this.init.emit()
      }
    }
  }

  @Input({required: true})
  jianpuMode!: boolean;

  private context: RenderContext | undefined;
  private stave: BeatsStave | undefined;

  @Output() init = new EventEmitter<void>();


  constructor(
    private readonly angularRenderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    MetricsDefaults['Stave'].padding = 12;

    const voices = this._voices;
    if (voices && voices.length) {
      this.initv5Grid();
      this.drawVoices(voices, this.stave!!, this.context!!)
    }
  }

  private clear() {
    // if (this.context) {
    //   this.context.clear();
    // }
    // this.stave = undefined;
    // this.context = undefined;
    const div = this.requireDiv(this.div);
    while (div.firstChild) {
      div.removeChild(div.firstChild); // TODO Pour supprimer tous les éléments du DIV en attendant de trouver comment clear/refresh VexFlow
      // this.angularRenderer.removeChild(div, div.firstChild)
      // alert('ok')
    }
  }

  private initv5Grid() {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div);
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(WIDTH, HEIGHT);
    const context = renderer.getContext();
    this.context = context;
    // context.clear();

    // Create a stave on the canvas.
    const stave = new BeatsStave(STAVE_X, STAVE_Y, WIDTH - 1, {
      numLines: this.jianpuMode ? 4 : 5,
    });
    this.stave = stave;
    // stave.setStaveText('Violin', Modifier.Position.ABOVE);

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
  }

  private drawVoices(voices: Voice[], stave: BeatsStave, context: RenderContext) {
    const formatter = new BeatsFormatter();
    formatter.joinVoices(voices).format(voices, stave.width, {
      stave: stave,
      autoBeam: true,
    });

    // Render voices.
    voices.forEach(function (voice) {
      voice.draw(context, stave);
    });
  }

  private requireDiv(divRef: ElementRef<HTMLDivElement> | undefined) {
    const div = divRef?.nativeElement
    if (!div) {
      throw new Error('div Vexflow introuvable')        ;
    }
    return div;
  }

}
