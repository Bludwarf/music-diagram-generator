import {FretboardData, Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";
import recordingInitData from "../../../assets/recordings/SURCOUF Preview voix_02.json";
import {Key} from "../../notes";
import {Recording} from "../../recording/recording";
import {Section} from "../../structure/section/section";
import {Part} from "../../structure/part/part";
import {BLUE} from "../../color";

const key = Key.Bb
const fretboard: FretboardData = {
  lowestFret: 0,
  fretsCount: 6,
}

// Morceau en 3/4 très rapide

const CData = {
  key,
  name: 'Couplet',
  chords: '| Bb | Bb | Eb | Bb | Bb | Bb | F | F |',
  fretboard,
}

const C = Pattern.fromData(CData)

const Cp = Pattern.fromData({
  ...CData,
  name: 'Couplet\'',
  initial: 'C\'',
  chords: '| Eb | Eb | Bb | Bb | F | Eb | Bb | Bb |',
})

const R = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| G | G | D | D | Eb | Eb | Bb | Bb |',
  fretboard,
})

const soloCornemuse = new Section('Solo Corn.', [C, C, Cp], undefined, BLUE);
const soloCornemusePlusBatt = new Section('+ batt.', [C, C, Cp], undefined, BLUE);
const coupletCornemuse = new Section('Cornemuse', [C, C, Cp], 'Kc', BLUE);
const couplet = new Section('Couplet', [C, C, Cp]);
const refrainCornemuse = new Section('Cornemuse', [R, R, R, R], 'Kr', BLUE);
const refrain = new Section('Refrain', [R, R], 'R');

const parts: Part[] = [
  new Part('Intro', [soloCornemuse, soloCornemusePlusBatt]),
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
  version: 'Album',
  structure,
  recording,
}
