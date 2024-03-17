import stuctureObject from "../../../assets/structures/Surcouf.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";

const key = Key.Bb
const fretboard: FretboardData = {
  lowestFret: 0,
  fretsCount: 6,
}

// Morceau en 3/4 très rapide

const soloBombarde = Pattern.fromData({
  key,
  name: 'Solo bombarde',
  initial: 'B',
  duration: '4m',
  fretboard,
})

const couplet = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '|' +
    ' Bb | Bb | Eb | Bb | Bb | Bb | F | F |' +
    ' Bb | Bb | Eb | Bb | Bb | Bb | F | F |' +
    ' Eb | Eb | Bb | Bb | F | Eb | Bb | Bb |',
  fretboard,
})

const refrain = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '|' +
    ' G | G | D | D | Eb | Eb | Bb | Bb |' +
    ' G | G | D | D | Eb | Eb | Bb | Bb |',
  fretboard,
})

const patterns: Pattern[] = [
  soloBombarde,
  couplet, couplet, couplet, couplet, refrain, refrain, refrain,
  couplet, couplet, refrain, refrain, refrain,
  couplet, soloBombarde, couplet, couplet,
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: 'Surcouf',
  structure,
}
