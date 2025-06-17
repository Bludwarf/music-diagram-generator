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

const IData = {
  key: Key.Cm,
  name: 'Intro',
  chords: '| Cm | Gm | Bb | F |',
  fretboard: {
    lowestFret: 0,
    fretsCount: 5,
  },
};
const I = Pattern.fromData(IData)

const C = Pattern.fromData({
  ...IData,
  name: 'Couplet',
})

const RData = {
  ...IData,
  name: 'Refrain',
};
const R = Pattern.fromData(RData)


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const intro = new Section('Intro', [C, C, C, C], undefined, BLUE)
const couplet = new Section('Couplet', [C, C, C, C])
const bomb = new Section('Bombarde', [C, C, C, C], undefined, BLUE)
const refrain = new Section('Refrain', [R, R, R, R])


/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Au son des bars',
  version: '06/01/2024',
  structure: Structure.builder()
    .parts([
      new Part('I', [intro]),
      new Part('1', [bomb, couplet, bomb, couplet, refrain]),
      new Part('2', [bomb, couplet, bomb, couplet, refrain]),
      new Part('F', [bomb]),
    ])
    .build(),
} as SongEntry
