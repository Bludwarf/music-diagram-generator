import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";
import {Section} from "../../structure/section/section";
import recordingInitData from "../../../assets/recordings/NUAGES BLANCS PréMaster Brut v2.02 SANS_01.json";
import {Recording} from "../../recording/recording";
import {Part} from "../../structure/part/part";

const key = Key.Gm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 6,
}

// Tempo rapide

const i = Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| G | C |',
  fretboard,
})

const fin = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| G |',
  fretboard,
})

const c = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| G | C | Gb | D |',
  fretboard,
})

const r = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| Eb | Bb | F | F |',
  fretboard,
})

const rp = Pattern.fromData({
  key,
  name: 'Refrain (fin)',
  initial: 'R\'',
  chords: '| Eb | Bb | D | D |',
  fretboard,
})

const sB = Pattern.fromData({
  key,
  name: 'Solo (base)',
  initial: 'Sb',
  chords: '| G | G |',
  fretboard,
})

const sAData = ({
  key,
  name: 'Solo (accords)',
  fretboard: {
    lowestFret: 8,
    fretsCount: 8,
  }
})

const sAG = Pattern.fromData({
  ...sAData,
  initial: 'Gm',
  chords: '| Gm | Gm |',
})

const sAD = Pattern.fromData({
  ...sAData,
  initial: 'Dm',
  chords: '| Dm | Dm |',
})

const sAC = Pattern.fromData({
  ...sAData,
  initial: 'Cm',
  chords: '| Cm | Cm |',
})

const sADMaj = Pattern.fromData({
  ...sAData,
  initial: 'D*',
  chords: '| Dm | D |',
})

const couplet = new Section('Couplet', [c, c, c,]);
const refrain = new Section('Refrain', [r, r, r, rp,]);
const bombarde = new Section('Bombarde', [i, i, i, i, i, i, i, i,]);

const coupletRap = new Section('Couplet (rap)', [c, c, c,]);

const parts: Part[] = [
  new Part('Intro', [
    new Section(`D'nB`, [i, i, i, i, i, i, i, i,]) // 8 fois I
  ]),
  new Part('1', [couplet, refrain, bombarde,]),
  new Part('2', [couplet, refrain, bombarde,]),
  new Part('Solo', [
    new Section(`D'nB`, [sB, sB, sB, sB]),
    new Section(`Accords`, [sAG, sAG, sAD, sAD, sAC, sAC, sADMaj, sADMaj]),
    new Section(`D'nB`, [sB, sB, sB, sB]),
  ]),
  new Part('3', [coupletRap, refrain, bombarde,]),
  new Part('4', [couplet, refrain, bombarde,]),
  new Part('Fin', [
    new Section('Fin', [i, i, i, i, fin])
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
