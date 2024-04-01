import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import recordingInitData from "../../../assets/recordings/SURCOUF Preview voix_02.json";
import {Key} from "../../notes";
import {Recording} from "../../recording/recording";
import {Section} from "../../structure/section/section";
import {Part} from "../../structure/part/part";

const key = Key.Bb
const fretboard: FretboardData = {
  lowestFret: 0,
  fretsCount: 6,
}

// Morceau en 3/4 très rapide

const Sk = Pattern.fromData({
  key,
  name: 'Solo bombarde',
  initial: 'B',
  duration: '4m',
  fretboard,
})

const C = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '|' +
    ' Bb | Bb | Eb | Bb | Bb | Bb | F | F |' +
    ' Bb | Bb | Eb | Bb | Bb | Bb | F | F |' +
    ' Eb | Eb | Bb | Bb | F | Eb | Bb | Bb |',
  fretboard,
})

const R = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '|' +
    ' G | G | D | D | Eb | Eb | Bb | Bb |' +
    ' G | G | D | D | Eb | Eb | Bb | Bb |',
  fretboard,
})

const sections: Section[] = [
  new Section('3', [C, Sk, C, C,]),
]

const soloCornemuse = new Section('Cornemuse (seule)', [Sk]);
const coupletCornemuse = new Section('Couplet (Cornemuse)', [C], 'Ck');
const couplet = new Section('Couplet', [C]);
const refrainCornemuse = new Section('Refrain (Cornemuse)', [R, R], 'Rk');
const refrain = new Section('Refrain', [R], 'R');

const parts: Part[] = [
  new Part('Intro', [soloCornemuse]),
  new Part('1', [coupletCornemuse, couplet, coupletCornemuse, couplet, refrainCornemuse, refrain]),
  new Part('2', [coupletCornemuse, couplet, coupletCornemuse, couplet, refrainCornemuse, refrain]),
  new Part('3', [coupletCornemuse, soloCornemuse, coupletCornemuse, coupletCornemuse]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Surcouf',
  structure,
  recording,
}
