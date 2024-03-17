import stuctureObject from "../../../assets/structures/Le résistant.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";

const key = Key.Cm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 6,
}

const couplet = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| G | G | Bb | Bb | D | Eb | Bb | F |',
  fretboard,
})

const refrain = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| C | C | G | G | C | C | D |',
  fretboard,
})

const silence = Pattern.fromData({
  key,
  name: 'Silence',
  duration: '1m',
})

const fin = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| G |',
  fretboard,
})

const patterns: Pattern[] = [
  couplet, couplet, couplet, couplet, couplet, refrain, silence,
  couplet, couplet, couplet, couplet, refrain, silence,
  couplet, fin,
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: 'Le résistant',
  structure,
}
