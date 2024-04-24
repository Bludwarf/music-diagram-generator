import {Key} from "../../notes";
import {Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";
import recordingInitData from "../../../assets/recordings/LA FEMME DRAGON MasterBrut_01.json";
import {Recording} from "../../recording/recording";
import {Part} from "../../structure/part/part";
import { GREEN_CF, GREEN_CS } from "../../color";


const fretboard = {
  lowestFret: 0,
  fretsCount: 4,
}

const coupletSansBasse = Pattern.fromData({
  key: Key.Am,
  name: 'Couplet (sans basse)',
  initial: 'Cs',
  duration: '4m',
  color: GREEN_CS,
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

const refrainPData = {
  ...refrainData,
  initial: 'R\'',
  chords: '| A | E | F | F |',
};

const refrainCalme = Pattern.fromData({
  ...refrainData,
  name: 'Refrain (calme)',
});

const refrainPCalme = Pattern.fromData({
  ...refrainPData,
  name: 'Refrain\' (calme)',
});

const refrain = Pattern.fromData(refrainData);

const refrainP = Pattern.fromData(refrainPData);

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
  color: GREEN_CF,
})

const refrainFinalData = {
  key: Key.Cm,
  name: 'Refrain final',
  chords: '| C | G | Ab | Bb |',
  fretboard: fretboardFinal,
}

const refrainFinal = Pattern.fromData(refrainFinalData)

const refrainPFinal = Pattern.fromData({
  ...refrainFinalData,
  name: 'Refrain\' final',
  initial: 'R\'',
  chords: '| C | G | Ab | Ab |',
})

const parts: Part[] = [
  new Part('1', [
    new Section('Intro', [coupletSansBasse]),
    new Section('Couplet', [coupletSansBasse, coupletSansBasse]),
    new Section('Refrain', [refrainCalme, refrainPCalme]),
  ]),
  new Part('2', [
    new Section('Flute', [couplet, couplet]),
    new Section('Couplet', [couplet, couplet]),
    new Section('Refrain', [refrain, refrainP]),
  ]),
  new Part('3', [
    new Section('Flute', [couplet, couplet]),
    new Section('Couplet', [couplet, couplet]),
    new Section('Refrain', [refrain, refrainP]),
    new Section('Guitare', [couplet, couplet]),
  ]),
  new Part('Calme', [
    new Section('Guitare', [coupletSansBasse, coupletSansBasse]),
    new Section('Couplet', [coupletSansBasse, coupletSansBasse]),
    new Section('Refrain', [refrainCalme, refrainPCalme]),
  ]),
  new Part('Final', [
    new Section('Bombarde', [coupletFinal, coupletFinal]),
    new Section('Couplet', [coupletFinal, coupletFinal]),
    new Section('Refrain', [refrainFinal, refrainPFinal]),
    new Section('Bombarde', [coupletFinal, coupletFinal]),
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'La femme dragon',
  structure,
  recording,
}
