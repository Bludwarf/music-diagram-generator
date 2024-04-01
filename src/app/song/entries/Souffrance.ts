import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
// FIXME : Pour Noyer le silence, on n'arrive pas à trouver le vrai sampleBeatTimeDuration : on a 485.9167899808525 alors que le dernier WarpMarker tombe sur 557.7314838807026
import recordingInitData from "../../../assets/recordings/NOYER LE SILENCE Master Brut_01.json";
import {Key} from "../../notes";
import {Section} from "../../structure/section/section";
import {Recording} from "../../recording/recording";
import {Part} from "../../structure/part/part";

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

const parts: Part[] = [
  new Part('Intro', [
    new Section('Solo Bombarde', [i]),
    new Section('Instru', [i, i, i]),
  ]),
  new Part('1', [
    new Section('Couplet', [c, c]),
    new Section('Bombarde', [i, i]),
    new Section('Couplet', [c, c]),
    new Section('Refrain', [r, r]),
    new Section('Bombarde', [i, i]),
  ]),
  new Part('2', [
    new Section('Couplet', [c, c]),
    new Section('Bombarde', [i, i]),
    new Section('Couplet', [c, c]),
    new Section('Refrain', [r, r]),
    new Section('Bombarde', [i, i]),
  ]),
  new Part('Final', [
    new Section('Silence', [silence]),
    new Section('Montée', [i, i,]),
    new Section('Bombarde', [i, i]),
    new Section('Fin', [fin]),
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Noyer le silence', // TODO faire des alias
  structure,
  recording,
}
