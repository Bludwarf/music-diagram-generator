import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import {Key} from "../../notes";
import recordingInitData from "../../../assets/recordings/LE PHARE Master Web 24bit 48Khz_v2_04.json";
import {Section} from "../../structure/section/section";
import {Recording} from "../../recording/recording";
import {Part} from "../../structure/part/part";

const key = Key.Cm
const fretboard: FretboardData = {
  lowestFret: 1,
  fretsCount: 5,
}

// Morceau en 3/4 très rapide

const C = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| G | Bb | F | F |',
  fretboard,
})

const Ceb = Pattern.fromData({
  key,
  name: 'Couplet (Eb)',
  initial: 'C\'',
  chords: '| Eb | G | F | F |',
  fretboard,
})

const R = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| C | C | G | G | Bb | Bb | F | F |',
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
  chords: '| G | G | G |',
  fretboard,
})

const bombarde = new Section('Bombarde', [C, C, Ceb, Ceb,]);
const couplet = new Section('Couplet', [C, C, C, C,]);
const refrain = new Section('Refrain', [R, R,]);
const parts: Part[] = [
  new Part('Intro', [
    new Section('Bombarde + guitare', [C, C, Ceb, Ceb,]),
  ]),
  new Part('1', [
    bombarde, // Groupe
    couplet, // C
    refrain,
  ]),
  new Part('2', [
    bombarde,
    couplet, // C
    refrain,
  ]),
  new Part('3', [
    new Section('Bombarde', [C, C,]),
    new Section('Break', [bloquee, breakBatterie,], 'Bk'),
  ]),
  new Part('Final', [
    bombarde,
// bombarde, // Pas dans l'album
    new Section('Fin', [fin,])
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Le jour (le phare)',
  structure,
  recording,
}
