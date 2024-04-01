import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
// FIXME : Pour Noyer le silence, on n'arrive pas à trouver le vrai sampleBeatTimeDuration : on a 485.9167899808525 alors que le dernier WarpMarker tombe sur 557.7314838807026
import recordingInitData from "../../../assets/recordings/NOYER LE SILENCE Master Brut_01.json";
import {Key} from "../../notes";
import {Section} from "../../structure/section/section";
import {Recording} from "../../recording/recording";

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

const sections: Section[] = [
  new Section('Intro', [i, i, i, i,]),
  new Section('1', [c, c, i, i, c, c, r, r, i, i,]),
  new Section('2', [c, c, i, i, c, c, r, r, i, i,]),
  new Section('Final', [silence, i, i, i, i, fin,]),
]

const structure = Structure.builder()
  .sections(sections)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Noyer le silence', // TODO faire des alias
  structure,
  recording,
}
