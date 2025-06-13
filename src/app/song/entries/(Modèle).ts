import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Recording} from "../../recording/recording";
import recordingInitData from "../../../assets/recordings/ELLE REVE preview brut_01.json";
import {Section} from "../../structure/section/section";
import {Pattern, PatternInitData} from "../../structure/pattern/pattern";
import {Key} from "../../notes";
import {SongEntry} from "../song-entry";


/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const IData = {
  key: Key.Cm,
  name: 'Intro',
  chords: '| Cm | Gm | Bb | F |',
  fretboard: {
    lowestFret: 0,
    fretsCount: 5,
  },
} as PatternInitData
const I = Pattern.fromData(IData)

const C = Pattern.fromData({
  ...IData,
  name: 'Couplet',
})

const RData = {
  ...IData,
  name: 'Refrain',
} as PatternInitData
const R = Pattern.fromData(RData)


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const intro = new Section('Intro', [I, I])
const couplet = new Section('Couplet', [C, C])
const refrain = new Section('Refrain', [R, R])


/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Intro',
  structure: Structure.builder()
    .parts([
      new Part('I', [intro]),
      new Part('1', [couplet, refrain]),
      new Part('2', [couplet, refrain]),
    ])
    .build(),
  recording: Recording.builder()
    .initData(recordingInitData)
    .build(),
} as SongEntry
