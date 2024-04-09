import { FretboardData, Pattern } from "../../structure/pattern/pattern";
import { Structure } from "../../structure/structure";
import { Key } from "../../notes";
import { Section } from "../../structure/section/section";
import recordingInitData from "../../../assets/recordings/NUAGES BLANCS PréMaster Brut v2.02 SANS_01.json";
import { Recording } from "../../recording/recording";
import { Part } from "../../structure/part/part";

const key = Key.Gm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 6,
}

// Tempo rapide

const I = Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| Gm | Cm | Gm | Cm |',
  fretboard,
})

const Ip = Pattern.fromData({
  key,
  name: 'Intro\'',
  initial: 'I\'',
  chords: '| Gm | Cm | Gm | Gm |',
  fretboard,
})

const F = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| Gm |',
  fretboard,
})

const C = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| Gm | Cm | Gbm | Dm |',
  fretboard,
})

const R = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| Eb | Bb | F | F |',
  fretboard,
})

const Rp = Pattern.fromData({
  key,
  name: 'Refrain (fin)',
  initial: 'R\'',
  chords: '| Eb | Bb | Dm | Dm |',
  fretboard,
})

const Sb = Pattern.fromData({
  key,
  name: 'Solo (base)',
  initial: 'Sb',
  chords: '| Gm | Gm | Gm | Gm |',
  fretboard,
})

const SAData = ({
  key,
  name: 'Solo (accords)',
  fretboard: {
    lowestFret: 8,
    fretsCount: 8,
  }
})

const SAG = Pattern.fromData({
  ...SAData,
  name: 'Solo (Gm)',
  initial: 'Gm',
  chords: '| Gm | Gm | Gm | Gm |',
})

const SAD = Pattern.fromData({
  ...SAData,
  name: 'Solo (Dm)',
  initial: 'Dm',
  chords: '| Dm | Dm | Dm | Dm |',
})

const SAC = Pattern.fromData({
  ...SAData,
  name: 'Solo (Cm)',
  initial: 'Cm',
  chords: '| Cm | Cm | Cm | Cm |',
})

const SADMaj = Pattern.fromData({
  ...SAData,
  name: 'Solo (Dm D)',
  initial: 'D*',
  chords: '| Dm | Dm | D | D |',
})

const couplet = new Section('Couplet', [C, C, C]);
const refrain = new Section('Refrain', [R, R, R, Rp]);
const bombarde = new Section('Bombarde', [I, I, I, I]);

const coupletRap = new Section('Couplet (rap)', [C, C, C]);

const parts: Part[] = [
  new Part('Intro', [
    new Section(`D'nB`, [I, I, I, Ip])
  ]),
  new Part('1', [couplet, refrain, bombarde]),
  new Part('2', [couplet, refrain, bombarde]),
  new Part('Solo', [
    new Section(`D'nB`, [Sb, Sb]),
    new Section(`Accords`, [SAG, SAD, SAC, SADMaj]),
    new Section(`D'nB`, [Sb, Sb]),
  ]),
  new Part('3', [coupletRap, refrain, bombarde]),
  new Part('4', [couplet, refrain, bombarde]),
  new Part('Fin', [
    new Section('Fin', [I, Ip, F])
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Nuages blancs',
  structure,
  recording,
}
