import {Key} from "../../notes";
import recordingInitData from "../../../assets/recordings/LE RESISTANT Pré-Masterbrut_02-01.json";
import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Recording} from "../../recording/recording";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";
import {Part} from "../../structure/part/part";
import {BLUE} from "../../color";

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
  chords: '| C | C | G | G | C | C | D | D |',
  fretboard,
})

const fin = Pattern.fromData({
  key,
  name: 'Fin',
  chords: '| G |',
  fretboard,
})

const bombarde = new Section(`Bombarde`, [couplet], undefined, BLUE);

const parts: Part[] = [
  new Part('Intro', [
    new Section(`D'nB`, [couplet], undefined, BLUE),
  ]),
  new Part('1', [
    bombarde,
    new Section(`Couplet`, [couplet, couplet]),
    bombarde,
    new Section(`Refrain`, [refrain]),
  ]),
  new Part('2', [
    bombarde,
    new Section(`Couplet`, [couplet, couplet]),
    bombarde,
    new Section(`Refrain`, [refrain]),
  ]),
  new Part('Final', [
    bombarde, // TODO notation pour marquer que le dernier F est sec (point en bas de la note en solfège)
    new Section(`Fin`, [fin]),
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Le résistant',
  version: 'Album',
  structure,
  recording,
}
