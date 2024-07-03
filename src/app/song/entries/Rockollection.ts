import {Key} from '../../notes';
import recordingInitData from '../../../assets/recordings/Rockollection.json';
import {Pattern} from '../../structure/pattern/pattern';
import {Recording} from '../../recording/recording';
import {Structure} from '../../structure/structure';
import {Section} from '../../structure/section/section';
import {Part} from '../../structure/part/part';
import {BLUE, RED} from "../../color";

const key = Key.Gm
const fretboard = {
  lowestFret: 0,
  fretsCount: 5,
}

const intro = new Section('Intro', [Pattern.fromData({
  key,
  name: 'Intro',
  chords: '| Em | Em | C | C | Am | Am | C | B7 |',
  fretboard,
})])
const couplet = new Section('Couplet', [Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| Em | Em | Am | Am | Em | Em | Am | B7 |',
  fretboard,
})])
const refrain = new Section('Refrain', [Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| C | C | Em | Em | C | B7 |',
  fretboard,
})])

const loco = Pattern.fromData({
  key,
  name: 'Loco',
  chords: '| E | C#m |',
  fretboard,
});
const locoF = Pattern.fromData({
  key,
  name: 'Loco (fin)',
  chords: '| Am | C B7 |',
  fretboard,
});
const locomotion = new Section('Locomotion', [loco, loco, loco, locoF])

const interlude = new Section('Intro', [Pattern.fromData({
  key,
  name: 'interlude',
  chords: '| Em | Em |',
  fretboard,
  color: BLUE,
})])

const hard = new Section(`Hard day's night`, [Pattern.fromData({
  key,
  name: 'Hard',
  chords: '| E A | E | D | E | E A | E | D A | B7 |',
  fretboard,
})])

const getAround = new Section(`I Get Around`, [Pattern.fromData({
  key,
  name: 'I Get Around',
  chords: '| G | E7 | Am | F D | G D |',
  fretboard,
  color: RED,
})])

const g = Pattern.fromData({
  key,
  name: 'Gloria',
  chords: '| E E D A |',
  fretboard,
})
const gloria = new Section(`Gloria`, [g, g, g, g, g, g, g])

const s = Pattern.fromData({
  key,
  name: 'Satisfaction',
  chords: '| E | D A |',
  fretboard,
})
const satisfaction = new Section(`Satisfaction`, [s, s])

const b1 = Pattern.fromData({
  key,
  name: 'Bascule 1/2',
  chords: '| E | E |',
  fretboard,
});
const b2 = Pattern.fromData({
  key,
  name: 'Bascule 2/2',
  chords: '| F# | F# |',
  fretboard,
});
const bascules = new Section('Bascules', [b1, b1, b2, b2, b1, b1])

const parts: Part[] = [
  new Part('1', [intro, couplet, refrain, locomotion]),
  new Part('2', [interlude, couplet, refrain, hard]),
  new Part('3', [interlude, couplet, refrain, getAround]),
  new Part('4', [interlude, couplet, refrain, gloria]),
  new Part('5', [interlude, couplet, refrain, satisfaction]),
  new Part('6', [interlude, bascules]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Rockollection',
  structure,
  recording,
}
