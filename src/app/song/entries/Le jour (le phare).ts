import stuctureObject from "../../../assets/structures/Le jour (le phare).json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";
import {Section} from "../../structure/section/section";

const key = Key.Cm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 5,
}

// Morceau en 3/4 très rapide

const couplet = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| G | Bb | F | F |',
  fretboard,
})

const coupletEb = Pattern.fromData({
  key,
  name: 'Couplet (Eb)',
  initial: 'C\'',
  chords: '| Eb | G | F | F |',
  fretboard,
})

const refrain = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| C | G | Bb | F |',
  fretboard,
})

const bloquee = Pattern.fromData({
  key,
  name: 'Bloquée',
  duration: '1m',
})

const breakBatterie = Pattern.fromData({
  key,
  name: 'Break batterie',
  duration: '1m',
})

const fin = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| G |',
  fretboard,
})

const sections: Section[] = [
  new Section('Intro', [couplet, couplet, coupletEb, coupletEb,]), // PYM + David
  new Section('B1', [couplet, couplet, coupletEb, coupletEb,]), // Groupe
  new Section('C1', [couplet, couplet, couplet, couplet,]), // C
  new Section('R1', [refrain, refrain,]),

  new Section('B2', [couplet, couplet, coupletEb, coupletEb,]),
  new Section('C2', [couplet, couplet, couplet, couplet,]), // C
  new Section('R2', [refrain, refrain,]),

  new Section('B3', [couplet, couplet,]),
  new Section('Break', [bloquee, breakBatterie,]),

  new Section('Final', [couplet, couplet, coupletEb, coupletEb,]),
// new Section('Final2', [couplet, couplet, coupletEb, coupletEb]),// couplet, couplet, coupletEb, coupletEb,]) // Pas dans l'album

  new Section('Fin', [fin,])
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .sections(sections)
  .build()

export default {
  name: 'Le jour (le phare)',
  structure,
}
