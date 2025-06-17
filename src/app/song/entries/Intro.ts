import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Section} from "../../structure/section/section";
import {Pattern} from "../../structure/pattern/pattern";
import {Key} from "../../notes";
import {SongEntry} from "../song-entry";


/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const batt = Pattern.fromData({
  name: 'Intro batterie',
  initial: 'I',
  duration: '8m',
})

const AAData = {
  key: Key.Bb,
  name: 'AA',
  initial: 'AA',
  chords: '| Bb | Bb | Bb | Bb | G | Eb | Bb | F |',
};
const AA = Pattern.fromData(AAData)

const BB = Pattern.fromData({
  ...AAData,
  name: 'BB',
  initial: 'BB',
  chords: '| Bb | C# | Bb | Eb | Bb | C# | Bb | Eb F |',
})

const M = Pattern.fromData({
  ...AAData,
  name: 'Montée',
  initial: 'M',
  chords: undefined,
  duration: '7m',
})


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const introBatt = new Section('Intro batt.', [batt])
const introSonn = new Section('+ sonn.', [AA, BB])
const arriveeProg = new Section('+ prog. TLM', [AA, BB])
const montee = new Section('Montée', [M])
const tlm = new Section('TLM', [AA, BB, AA, BB])
const outro = new Section('Solo sonneurs', [AA, BB])
// TODO fin bazar


/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Intro',
  version: '30/05/2025',
  structure: Structure.builder()
    .parts([
      new Part('I', [introBatt]),
      new Part('1', [introSonn, arriveeProg, montee]),
      new Part('2', [tlm, montee]),
      new Part('O', [outro]),
    ])
    .build(),
} as SongEntry
