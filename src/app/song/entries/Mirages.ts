import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Section} from "../../structure/section/section";
import {Pattern} from "../../structure/pattern/pattern";
import {Key} from "../../notes";
import {SongEntry} from "../song-entry";
import {BLUE} from "../../color";


/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const CData = {
  key: Key.Cm,
  name: 'Couplet',
  chords: '| Cm | Eb | Cm | Eb |',
  fretboard: {
    lowestFret: 1,
    fretsCount: 6,
  },
};
const C = Pattern.fromData(CData)

const R = Pattern.fromData({
  ...CData,
  name: 'Refrain',
  chords: '| Cm | Eb | Fm | Cm |',
})

const B = Pattern.fromData({
  ...CData,
  name: 'Break',
  chords: '| Cm | Eb | Cm | Fm |',
})


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const intro = new Section('Intro', [C], undefined, BLUE)
const instru = new Section('Instru', [C], undefined, BLUE)
const refrain = new Section('Refrain', [R, R])
const refrainB = new Section('Bombarde', [R, R])


/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Mirages',
  version: '14/01/2017',
  structure: Structure.builder()
    .parts([
      new Part('I', [intro]),
      new Part('1', [instru, new Section('Couplet (nuit)', [C, C]), refrain]),
      new Part('2', [instru, new Section('Couplet (âmes)', [C, C]), refrain, new Section('Break', [B, B])]),
      new Part('3 (reggae)', [instru, new Section('Couplet (ombres)', [C, C]), refrain, refrainB]),
      new Part('4 (calme)', [instru, new Section('Couplet (yeux)', [C, C]), refrain, refrainB]),
      new Part('F', [instru, new Section('Couplet (réalité) ?', [C, C])]),
    ])
    .build(),
} as SongEntry
