import recordingInitData from "../../../assets/recordings/LA 4L.json";
import {Key} from "../../notes";
import {Recording} from "../../recording/recording";
import {Part} from "../../structure/part/part";
import {Pattern} from "../../structure/pattern/pattern";
import {Section} from "../../structure/section/section";
import {Structure} from "../../structure/structure";
import {BLUE, ORANGE} from "../../color";

const key = Key.Am
const fretboard = {
  lowestFret: 0,
  fretsCount: 5,
}

const I = Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| Am C | Am G |',
  fretboard,
})

const F = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| Am C |', // TODO notation pour fin sur le 3
  fretboard,
})

const CData = {
  key,
  name: 'Couplet',
  chords: '| Am Fm | C G |',
  fretboard,
}
const C = Pattern.fromData(CData)

const Cs = Pattern.fromData({
  ...CData,
  name: 'Couplet sautillant',
  initial: 'Cs',
})

const Csp = Pattern.fromData({
  ...CData,
  name: 'Couplet sautillant + pêches',
  initial: 'Cs\'',
  chords: '| Am Fm | C C C G |', // TODO notation rythmique pour les pêches sur le 3 et le 4 de la 2e mesure
})

const R = Pattern.fromData({
  ...CData,
  name: 'Refrain sautillant',
})

const intro = new Section('Intro', [I, I, I, I])
const bombarde = new Section('Bombarde', [C, C, C, C], undefined, BLUE)
const couplet = new Section('Couplet', [Cs, Cs, Cs, Cs])
const saxo = new Section('Saxo', [C, C, C, C], undefined, BLUE)
const refrain = new Section('Refrain', [Cs, Csp, Cs, Csp], undefined, ORANGE)
const dnb = new Section(`D'nB`, [I, I, I, I])
const final = new Section('Final', [I, I, I, F])

const parts: Part[] = [
  new Part('I', [intro, bombarde]),
  new Part('1', [couplet, saxo, refrain, bombarde]),
  new Part('2', [couplet, saxo, refrain, dnb, bombarde]),
  new Part('3', [couplet, saxo, refrain, final]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'La 4L',
  version: '08/05/2025',
  structure,
  recording,
}
