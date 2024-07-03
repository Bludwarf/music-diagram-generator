import {Key} from "../../notes";
import recordingInitData from "../../../assets/recordings/Happy.json";
import {Pattern} from "../../structure/pattern/pattern";
import {Recording} from "../../recording/recording";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";
import {Part} from "../../structure/part/part";

const key = Key.E
const fretboard = {
  lowestFret: 0,
  fretsCount: 5,
}

const I = Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| E7 |',
  fretboard,
})

const C = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| E | E | E | E |',
  fretboard,
})

const R = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| C7M | Bm7 | Bm7 | E |',
  fretboard,
})

const B = Pattern.fromData({
  key,
  name: 'Break',
  duration: '2m',
  fretboard,
})

const intro = new Section('Intro', [I])
const couplet = new Section('Couplet', [C, C, C, C])
const refrain = new Section('Refrain', [R, R, R, R])
const breakSection = new Section('Break', [B, B, B, B])
const gospel = new Section('Gospel', [B, B, B, B])

const parts: Part[] = [
  new Part('1', [intro, couplet, refrain]),
  new Part('2', [couplet, refrain]),
  new Part('3', [breakSection, gospel, refrain, refrain]),
  new Part('4', [gospel, refrain, refrain]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Happy',
  structure,
  recording,
}
