import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {
  Annotation,
  Beam,
  Dot,
  FontInfo,
  Formatter,
  MetricsDefaults,
  Renderer,
  Stave,
  StaveNote,
  Stem,
  TextNote,
  VexFlow,
  Voice
} from "vexflow";
import {SongEntry} from "../../song/song-entry";
import {BeatsStave} from "../../vexflow/beats-stave";
import {CustomStaveNote} from "../../vexflow/custom-stave-note";
import {BeatsFormatter} from "../../vexflow/beats-formatter";
import {sequence} from "../../utils";
import {TextNoteStruct} from "vexflow/build/types/src/textnote";

const WIDTH = 500;
const HEIGHT = 150;
const STAVE_X = 0;
const STAVE_Y = 20;

/**
 * @type {FontInfo}
 */
const font = {
  family: 'Beats',
}

function getNotesFromDidaf() {
  return [
    new Voice({
      numBeats: 4,
      beatValue: 4,
    }).addTickables([
      dotted(
        new CustomStaveNote({keys: ['A/4'], duration: '8d'})
          .addModifier(new Annotation('V1').setFont(font))
          .addModifier(new Annotation('1').setVerticalJustification(Annotation.VerticalJustify.BOTTOM))
      ),
      dotted(
        new CustomStaveNote({keys: ['A/4'], duration: '8d'})
          .addModifier(new Annotation('\\').setFont(font)) // TODO Ajouter la ligature \2 (idem \3)
          .addModifier(new Annotation('1').setVerticalJustification(Annotation.VerticalJustify.BOTTOM))
      ),
      new CustomStaveNote({keys: ['A/4'], duration: '8'})
        .addModifier(new Annotation('&2').setFont(font))
        .addModifier(new Annotation('1').setVerticalJustification(Annotation.VerticalJustify.BOTTOM))
      ,
      new CustomStaveNote({keys: ['C/5'], duration: 'q', stemDirection: Stem.DOWN})
        .addModifier(new Annotation('V3').setFont(font))
        .addModifier(new Annotation('b3').setVerticalJustification(Annotation.VerticalJustify.BOTTOM))
      ,
      new CustomStaveNote({keys: ['b/4'], duration: 'qr'}),
    ]),
  ];
}

function lyricTextNote(noteStruct: TextNoteStruct): TextNote {
  return new TextNote(noteStruct)
    .setJustification(TextNote.Justification.CENTER)
    .setLine(9);
}

export function getVoicesFromTheSims() {
  return [

    // Accords
    new Voice({
      numBeats: 4,
      beatValue: 4,
    }).addTickables([
      new TextNote({text: 'C5', duration: '1'}).setJustification(TextNote.Justification.LEFT),
    ]),

    // Notes
    new Voice({
      numBeats: 4,
      beatValue: 4,
    }).addTickables([
      new CustomStaveNote({keys: ['A/4'], duration: '8'}),
      new CustomStaveNote({keys: ['E/5'], duration: 'q'}),
      new CustomStaveNote({keys: ['E/5'], duration: 'q'}),
      new CustomStaveNote({keys: ['E/5'], duration: 'q'}),
      new CustomStaveNote({keys: ['E/5'], duration: '8'}),
    ]),

    // Paroles
    new Voice({
      numBeats: 4,
      beatValue: 4,
    }).addTickables([
      lyricTextNote({text: 'Do', duration: '8'}),
      lyricTextNote({text: 'sol', duration: 'q'}),
      lyricTextNote({text: 'sol', duration: 'q'}),
      lyricTextNote({text: 'sol', duration: 'q'}),
      lyricTextNote({text: 'sol', duration: '8'}),
    ]),
  ];
}

@Component({
  selector: 'app-test-vex-flow',
  standalone: true,
  imports: [],
  templateUrl: './test-vex-flow.component.html',
  styleUrl: './test-vex-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestVexflowComponent implements AfterViewInit {

  id1 = Math.random() // TODO comment faire plus simple ?
  id2 = Math.random() // TODO comment faire plus simple ?
  id3 = Math.random() // TODO comment faire plus simple ?
  id4 = Math.random() // TODO comment faire plus simple ?

  @Input() songEntry!: SongEntry;

  @ViewChild('output1')
  div1?: ElementRef<HTMLDivElement>;
  @ViewChild('output2')
  div2?: ElementRef<HTMLDivElement>;
  @ViewChild('output3')
  div3?: ElementRef<HTMLDivElement>;
  @ViewChild('output4')
  div4?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    MetricsDefaults['Stave'].padding = 12;
    const voices = getVoicesFromTheSims();
    this.initv5(voices);
    this.initv5Grid(voices);
    // this.initv5Grid16th();
    // this.initv5GridBeatsSvg();
  }

  private initFromSongEntry() {
    const notes = this.getEasyScoreNotes();
    if (!notes) {
      return;
    }

    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div1);
    const width = 200;
    const f = new VexFlow.Factory({
      renderer: {elementId: div.id, width: width + 1, height: 113},
    });

    const stave = f.Stave({
      width, // TODO nécessaire ?
    })
    const score = f.EasyScore();

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    // Nécessaire ?
    // const tickContext = new TickContext();
    // notes.forEach(note => note.setTickContext(tickContext))

    const voice = score.voice(score.notes(notes), {time: '4/4'});

    // Takes a voice and returns its auto beams.
    // const beams = Beam.generateBeams(notes, {
    //   // groups: [new Fraction(4, 4)],
    //   // flatBeams: true,
    // });
    // const beams = Beam.applyAndGetBeams(voice);
    // beams.forEach((beam) => beam.setContext(context).drawWithStyle());

    const beams = Beam.applyAndGetBeams(voice);

    const voices = [voice];
    f.Formatter()
      .joinVoices(voices)
      .formatToStave(voices, stave) // width - (21 * 2)

    f.draw();

    beams.forEach((beam) => beam.setContext(f.getContext()).drawWithStyle());
  }

  private requireDiv(divRef: ElementRef<HTMLDivElement> | undefined) {
    const div = divRef?.nativeElement
    if (!div) {
      throw new Error('div Vexflow introuvable')        ;
    }
    return div;
  }

  private initv5(voices: Voice[]) {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div1);
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(WIDTH, HEIGHT);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new Stave(STAVE_X, STAVE_Y, WIDTH - 1);

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Format and justify the notes
    new Formatter().joinVoices(voices).format(voices, stave.width);

    // Render voices.
    voices.forEach(function (voice) {
      voice.draw(context, stave);
    });
  }

  private initv5Grid(voices: Voice[]) {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div2);
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(WIDTH, HEIGHT);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new BeatsStave(STAVE_X, STAVE_Y, WIDTH - 1);
    // stave.setStaveText('Violin', Modifier.Position.ABOVE);

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Version avec formatter
    // // Format and justify the notes to 400 pixels.
    // const formatter = new Formatter();
    // formatter.joinVoices(voices).format(voices, 350);
    // console.log(`formatter`, formatter);

    // Versions sans formatter
    const formatter = new BeatsFormatter();
    formatter.joinVoices(voices).format(voices, stave.width, {
      stave: stave,
    });

    voices.forEach(voice => {
      voice.getTickables().forEach(tickable => {
        // console.log(`tickable`, tickable);
      })
    })

    // Render voices.
    voices.forEach(function (voice) {
      voice.draw(context, stave);
    });
  }

  private initv5Grid16th() {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div3);
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(WIDTH, HEIGHT);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new BeatsStave(STAVE_X, STAVE_Y, WIDTH - 1);

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    /**
     * @type {FontInfo}
     */
    const font = {
      family: 'Beats',
    }

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    const notes = sequence(16).map(i => {
      const beat = Math.floor(i / 4) + 1;
      const note = new CustomStaveNote({keys: ['A/4'], duration: '16'});
      // if (i % 4 === 0) {
      //   note.addModifier(new Annotation(`V${beat}`).setFont(font))
      // }
      // if (i % 4 === 1) {
      //   note.addModifier(new Annotation(`/`).setFont(font))
      // }
      // if (i % 4 === 2) {
      //   note.addModifier(new Annotation(`&${beat}`).setFont(font))
      // }
      // if (i % 4 === 3) {
      //   note.addModifier(new Annotation('\\').setFont(font))
      // }
      return note;
    });

    // Create a voice in 4/4 and add above notes
    const voices = [
      new Voice({
        numBeats: 4,
        beatValue: 4,
      }).addTickables(notes),
    ];

    // Versions sans formatter
    const formatter = new BeatsFormatter();
    formatter.joinVoices(voices).format(voices, stave.width, {
      stave: stave,
    });

    voices.forEach(voice => {
      voice.getTickables().forEach(tickable => {
        // console.log(`tickable`, tickable);
      })
    })

    // Render voices.
    voices.forEach(function (voice) {
      voice.draw(context, stave);
    });
  }

  private initv5GridBeatsSvg() {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = this.requireDiv(this.div4);
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(WIDTH, HEIGHT);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new BeatsStave(STAVE_X, STAVE_Y, WIDTH - 1);

    /**
     * @type {FontInfo}
     */
    const font = {
      family: 'Beats',
    }

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

  }

  // https://github.com/0xfe/vexflow/wiki/Using-EasyScore
  private getEasyScoreNotes(): string | undefined {
    switch (this.songEntry.name) {
      case 'La 4L':
        return 'A4/8., A4/8., A4, C5/q, B4/r';
      case 'Nuages blancs':
        return 'G4/8., G4/8., Bb4, C5/8., C5/8., Bb4';
      default:
        console.error(`Partition inconnue pour : ${this.songEntry.name}`);
        return undefined;
    }
  }
}

function dotted(staveNote: StaveNote, noteIndex = -1) {
  if (noteIndex < 0) {
    Dot.buildAndAttach([staveNote], {
      all: true,
    });
  } else {
    Dot.buildAndAttach([staveNote], {
      index: noteIndex,
    });
  }
  return staveNote;
}
