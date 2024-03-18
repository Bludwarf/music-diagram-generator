import {Key} from "../../notes";
import stuctureObject from "../../../assets/structures/La femme dragon.json";
import {Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";


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

const refrainCalme = Pattern.fromData({
  key: Key.Am,
  name: 'Refrain calme',
  chords: '| A | E | F | G |',
  fretboard: {
    lowestFret: 5,
    fretsCount: 6,
  },
})

const refrain = Pattern.fromData({
  key: Key.Am,
  name: 'Refrain',
  chords: '| A | E | F | G |',
  fretboard,
})

const couplet_fois_4 = [couplet, couplet, couplet, couplet]
const refrain_fois_2 = [refrain, refrain]

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

const refrainFinal = Pattern.fromData({
  key: Key.Cm,
  name: 'Refrain final',
  initial: 'Rf',
  chords: '| C | G | Ab | Bb |',
  fretboard: fretboardFinal,
})

const sections = [
  new Section('1', [coupletSansBasse, coupletSansBasse, coupletSansBasse, refrainCalme, refrainCalme]),
  new Section('2', [...couplet_fois_4, ...refrain_fois_2]),
  new Section('3', [...couplet_fois_4, ...refrain_fois_2, couplet, couplet]),
  new Section('Calme', [coupletSansBasse, coupletSansBasse, coupletSansBasse, coupletSansBasse, refrainCalme, refrainCalme]),
  new Section('Final', [coupletFinal, coupletFinal, coupletFinal, coupletFinal, refrainFinal, refrainFinal, coupletFinal, coupletFinal]),
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .sections(sections)
  .build()

export default {
  name: 'La femme dragon',
  structure,
}
