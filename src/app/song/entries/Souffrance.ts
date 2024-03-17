import stuctureObject from "../../../assets/structures/Souffrance.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";

const key = Key.Cm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 5,
}

const i = Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| C | G | Eb | Bb |',
  fretboard,
})

const c = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| G | Bb | F | Eb |',
  fretboard,
})

const r = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| Eb | Bb | C | G |',
  fretboard,
})

const silence = Pattern.fromData({
  key,
  name: 'Silence',
  duration: '2m',
})

const fin = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| C |',
  fretboard,
})

const patterns: Pattern[] = [
  i, i, i, i,
  c, c, i, i, c, c, r, r, i, i,
  c, c, i, i, c, c, r, r, i, i,
  silence, i, i, i, i, fin,
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: 'Noyer le silence', // TODO faire des alias
  structure,
}
