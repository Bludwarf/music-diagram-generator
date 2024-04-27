
import recordingInitData from "../../../assets/recordings/ELLE REVE preview brut_01.json";
import { Key } from "../../notes";
import { Recording } from "../../recording/recording";
import { Part } from "../../structure/part/part";
import { Pattern } from "../../structure/pattern/pattern";
import { Section } from "../../structure/section/section";
import { Structure } from "../../structure/structure";

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
const I = Pattern.fromData(IData)
const Blanc = Pattern.fromData({
    ...IData,
    name: 'Blanc',
    chords: undefined,
    duration: '1m',
})

const C = Pattern.fromData({
    ...IData,
    name: 'Couplet',
})

const B = Pattern.fromData({
    ...IData,
    name: 'Break',
    chords: '| Cm | Cm | Cm | Cm |',
})

const RData = {
    ...IData,
    name: 'Refrain',
    chords: '| Cm | Eb | Bb | Ab Bb |',
    fretboard,
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

const intro = new Section('Intro', [I, I, Blanc])
const instru = new Section('Instru', [C, C])
const couplet = new Section('Couplet', [C, C])
const refrain = new Section('Refrain', [R, R])
const breakSection = new Section('Break', [B, B])
const solo = new Section('Solo', [C, C, C, C])
const refrainBasse = new Section('Refrain à la basse', [R, R, R])
const instruFinal = new Section('Instru finale', [C, C, C, C, F])

const parts: Part[] = [
    new Part('I', [intro]),
    new Part('1', [instru, couplet, instru, couplet, refrain]),
    new Part('2', [instru, couplet, instru, couplet, refrain]),
    new Part('S', [solo]),
    new Part('Bk', [breakSection, refrainBasse]),
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
    structure,
    recording,
}    
