import stuctureObject from "../../../assets/structures/Le jour (le phare).json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";

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

const patterns: Pattern[] = [
  couplet, couplet, coupletEb, coupletEb, // PYM + David
  couplet, couplet, coupletEb, coupletEb, // Groupe
  couplet, couplet, couplet, couplet, // C
  refrain, refrain,

  couplet, couplet, coupletEb, coupletEb,
  couplet, couplet, couplet, couplet, // C
  refrain, refrain,

  couplet, couplet,
  bloquee, breakBatterie,

  couplet, couplet, coupletEb, coupletEb,
  // couplet, couplet, coupletEb, coupletEb, // Pas dans l'album

  fin,
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: 'Le jour (le phare)',
  structure,
}
