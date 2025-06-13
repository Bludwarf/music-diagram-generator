import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Section} from "../../structure/section/section";
import {Pattern, PatternInitData} from "../../structure/pattern/pattern";
import {Key} from "../../notes";
import {SongEntry} from "../song-entry";
import {GREEN, ORANGE} from "../../color";


/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const AData = {
  key: Key.Cm,
  name: 'A',
  chords: '| Cm | Bb | Eb | Fm |',
  fretboard: {
    lowestFret: 0,
    fretsCount: 5,
  },
  color: GREEN,
} as PatternInitData
const A = Pattern.fromData(AData)

const BData = {
  ...AData,
  name: 'B',
  chords: '| Cm | Fm | Ab | Bb |',
  color: A.color?.lighter(),
};
const B = Pattern.fromData(BData)

const Bp = Pattern.fromData({
  ...BData,
  name: 'B\'',
  initial: 'B\'',
  chords: '| Cm | Fm | Ab | Gm |',
})

const C = Pattern.fromData({
  ...AData,
  name: 'C',
  chords: '| Bb | Eb | Gm | Fm |',
  color: ORANGE.darker(),
})

const D = Pattern.fromData({
  ...AData,
  name: 'D',
  chords: '| Bb | Cm | Eb | Fm |',
  color: C.color?.lighter(),
})


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const AABB = [A, A, B, Bp]
const CCDD = [C, C, D, D, D, D]

const intro = new Section('Intro : Ted + Benoît', [...AABB, ...AABB])
const tlmA = new Section('TLM', [...AABB, ...AABB, ...AABB, ...AABB, ...AABB])
const aVide = new Section('Pipe + bombarde Si♭', [...CCDD])
const tlmC = new Section('TLM', [...CCDD, ...CCDD, ...CCDD])


/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Kas a-barh',
  version: '30/05/2025',
  structure: Structure.builder()
    .parts([
      new Part('', [intro]),
      new Part('', [tlmA]),
      new Part('', [aVide]),
      new Part('', [tlmC]),
      // TODO fin : Eb ralenti puis Fm ralenti
    ])
    .build(),
} as SongEntry
