import {Key} from "../../notes";
import {Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";
import recordingInitData from "../../../assets/recordings/LA FEMME DRAGON MasterBrut_01.json";
import {Recording} from "../../recording/recording";


const fretboard = {
  lowestFret: 0,
  fretsCount: 4,
}

const coupletSansBasse = Pattern.fromData({
  key: Key.Am,
  name: 'Couplet (sans basse)',
  initial: 'Cs',
  duration: '4m',
})

const couplet = Pattern.fromData({
  key: Key.Am,
  name: 'Couplet',
  chords: '| A | C | G | F |',
  fretboard,
})

const fretboardRefrain = {
  lowestFret: 5,
  fretsCount: 6,
}

const refrainData = {
  key: Key.Am,
  name: 'Refrain',
  chords: '| A | E | F | G |',
  fretboard: fretboardRefrain,
}

const refrainPData = Object.assign({}, refrainData, {
  initial: 'R\'',
  chords: '| A | E | F | F |',
});

const refrainCalme = Pattern.fromData(Object.assign({}, refrainData, {
  name: 'Refrain (calme)',
}));

const refrainPCalme = Pattern.fromData(Object.assign({}, refrainPData, {
  name: 'Refrain\' (calme)',
}));

const refrain = Pattern.fromData(refrainData);

const refrainP = Pattern.fromData(refrainPData);

const refrainCalme_fois_2 = [refrainCalme, refrainPCalme]
const couplet_fois_4 = [couplet, couplet, couplet, couplet]
const refrain_fois_2 = [refrain, refrainP]

const fretboardFinal = {
  lowestFret: 3,
  fretsCount: 4,
}

const coupletFinal = Pattern.fromData({
  key: Key.Cm,
  name: 'Couplet final',
  initial: 'Cf',
  chords: '| C | Eb | Bb | Ab |',
  fretboard: fretboardFinal,
})

const refrainFinalData = {
  key: Key.Cm,
  name: 'Refrain final',
  chords: '| C | G | Ab | Bb |',
  fretboard: fretboardFinal,
}

const refrainFinal = Pattern.fromData(refrainFinalData)

const refrainPFinal = Pattern.fromData(Object.assign({}, refrainFinalData, {
  name: 'Refrain\' final',
  initial: 'R\'',
  chords: '| C | G | Ab | Ab |',
}))

const refrain_final_fois_2 = [refrainFinal, refrainPFinal]

const sections = [
  new Section('1', [coupletSansBasse, coupletSansBasse, coupletSansBasse, ...refrainCalme_fois_2]),
  new Section('2', [...couplet_fois_4, ...refrain_fois_2]),
  new Section('3', [...couplet_fois_4, ...refrain_fois_2, couplet, couplet]),
  new Section('Calme', [coupletSansBasse, coupletSansBasse, coupletSansBasse, coupletSansBasse, ...refrainCalme_fois_2]),
  new Section('Final', [coupletFinal, coupletFinal, coupletFinal, coupletFinal, ...refrain_final_fois_2, coupletFinal, coupletFinal]),
]

const structure = Structure.builder()
  .sections(sections)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'La femme dragon',
  structure,
  recording,
}
