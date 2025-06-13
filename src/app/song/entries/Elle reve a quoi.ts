
import recordingInitData from "../../../assets/recordings/ELLE REVE preview brut_01.json";
import { Key } from "../../notes";
import { Recording } from "../../recording/recording";
import { Part } from "../../structure/part/part";
import { Pattern } from "../../structure/pattern/pattern";
import { Section } from "../../structure/section/section";
import { Structure } from "../../structure/structure";
import {BLUE, GREEN, ORANGE, RED, VIOLET} from "../../color";

const key = Key.Cm
const fretboard = {
    lowestFret: 0,
    fretsCount: 5,
}

const IData = {
    key,
    name: 'Intro',
    chords: '| Cm | Gm | Bb | F |',
    fretboard,
};
const Blanc = Pattern.fromData({
    ...IData,
    name: 'Blanc',
    chords: undefined,
    duration: '1m',
})

const C = Pattern.fromData({
    ...IData,
    name: 'Couplet',
    color: GREEN,
})

const B = Pattern.fromData({
    ...IData,
    name: 'Break',
    chords: '| Cm | Cm | Cm | Cm |',
    color: VIOLET,
})

const RData = {
    ...IData,
    name: 'Refrain',
    chords: '| Cm | Eb | Bb | Ab Bb |',
    fretboard,
    color: ORANGE,
};
const R = Pattern.fromData(RData)
const RBasse = Pattern.fromData({
    ...RData,
    name: 'Refrain à la basse',
    initial: 'Rb',
})
const F = Pattern.fromData({
    ...IData,
    name: 'Fin',
    chords: '| Cm |'
})

const intro = new Section('Intro', [C, C, Blanc], undefined, BLUE)
const bomb = new Section('Bombarde', [C, C], undefined, BLUE)
const couplet = new Section('Couplet', [C, C])
const refrain = new Section('Refrain', [R, R])
const solo = new Section('Solo', [C, C, C, C], undefined, RED)
const dnb = new Section(`D'nB`, [B])
const dnbGtr = new Section('Hey !', [B, B])
const refrainBasse = new Section('Refrain', [R, R])
const instruFinal = new Section('Instru finale', [C, C, C, C, F])

const parts: Part[] = [
    new Part('I', [intro]),
    new Part('1', [bomb, couplet, bomb, couplet, refrain]),
    new Part('2', [bomb, couplet, bomb, couplet, refrain]),
    new Part('S', [solo]),
    new Part('Bk', [dnb, dnbGtr, refrainBasse]),
    new Part('F', [instruFinal]),
]

const structure = Structure.builder()
    .parts(parts)
    .build()

const recording = Recording.builder()
    .initData(recordingInitData)
    .build()

export default {
    name: 'Elle rêve à quoi',
    version: 'Album',
    structure,
    recording,
}    
