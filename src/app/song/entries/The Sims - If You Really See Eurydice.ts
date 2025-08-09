import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Recording} from "../../recording/recording";
import recordingInitData from "../../../assets/recordings/07 - If You Really See Eurydice.json";
import {Section} from "../../structure/section/section";
import {Pattern} from "../../structure/pattern/pattern";
import {SongEntry} from "../song-entry";
import {AbletonLive10Color} from "../../color";


/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const T1 = Pattern.fromData({
  // key: Key.Cm,
  name: 'Thème 1',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '2m',
  color: AbletonLive10Color.fromIndex(32),
})
const T2 = Pattern.fromData({
  // key: Key.Cm,
  name: 'Thème 2',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '2m',
  color: AbletonLive10Color.fromIndex(1),
})
const P = Pattern.fromData({
  // key: Key.Cm,
  name: 'Pont',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '11m',
  color: AbletonLive10Color.fromIndex(39),
})
const F = Pattern.fromData({
  // key: Key.Cm,
  name: 'Fin',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '11m',
  color: AbletonLive10Color.fromIndex(23),
})

/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const theme1 = new Section('Thème 1', T1.times(12))
const theme2 = new Section('Thème 2', T2.times(8))
const pont = new Section('Pont', P.times(1))
const fin = new Section('Fin', F.times(1))

/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'The Sims - If You Really See Eurydice',
  structure: Structure.builder()
    .parts([
      new Part('1', [theme1]),
      new Part('2', [theme2, pont]),
      new Part('3', [theme1, fin]),
    ])
    .build(),
  recording: Recording.builder()
    .initData(recordingInitData)
    .build(),
} as SongEntry
