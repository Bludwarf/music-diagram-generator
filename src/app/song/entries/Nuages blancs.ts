import stuctureObject from "../../../assets/structures/Nuages blancs.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";

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
  chords: '| G | C |', // TODO accords
  fretboard, // TODO fretboard
})

const sA = Pattern.fromData({
  key,
  name: 'Solo (accords)',
  initial: 'Sa',
  chords: '| G | C |', // TODO accords
  fretboard, // TODO fretboard
})

const patterns: Pattern[] = [
  i, i, i, i, i, i, i, i, // 8 fois I
  c, c, c, r, r, r, rp, i, i, i, i, i, i, i, i, // 8 fois I
  c, c, c, r, r, r, rp, i, i, i, i, i, i, i, i, // 8 fois I
  sB, sB, sB, sB, sA, sA, sA, sA, sA, sA, sA, sA, sB, sB, sB, sB, // solo = 16 fois I
  c, c, c, r, r, r, rp, i, i, i, i, i, i, i, i, // 8 fois I
  c, c, c, r, r, r, rp, i, i, i, i, i, i, i, i, // 8 fois I
  i, i, i, i, fin, // fin
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: 'Nuages blancs',
  structure,
}
