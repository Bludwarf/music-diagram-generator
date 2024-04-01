import {Key} from "../../notes";
import recordingInitData from "../../../assets/recordings/LE RESISTANT Pré-Masterbrut_02-01.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Recording} from "../../recording/recording";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";

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

const sections: Section[] = [
  new Section('1', [couplet, couplet, couplet, couplet, couplet, refrain, silence,]),
  new Section('2', [couplet, couplet, couplet, couplet, refrain, silence,]),
  new Section('Final', [couplet, fin,]),
]

const structure = Structure.builder()
  .sections(sections)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Le résistant',
  structure,
  recording,
}
