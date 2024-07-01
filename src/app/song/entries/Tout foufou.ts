
import { Key } from "../../notes";
import recordingInitData from "../../../assets/recordings/Tout foufou.json";
import { Pattern } from "../../structure/pattern/pattern";
import { Recording } from "../../recording/recording";
import { Structure } from "../../structure/structure";
import { Section } from "../../structure/section/section";
import { Part } from "../../structure/part/part";

const key = Key.Gm
const fretboard = {
    lowestFret: 0,
    fretsCount: 5,
}

const I = Pattern.fromData({
    key,
    name: 'Intro',
    chords: '| G | Am7 F#m | G | Em F#m |',
    fretboard,
})

const I2 = Pattern.fromData({
    key,
    name: 'Demi-Intro',
    chords: '| G | Am7 F#m |',
    fretboard,
})

const If = Pattern.fromData({
    key,
    name: 'Intro (fin)',
    chords: '| G | G | G | G |',
    fretboard,
})

const C = Pattern.fromData({
    key,
    name: 'Couplet',
    chords: '| G | G | G | G | G | F#m | Em |',
    fretboard,
})

const Cp = Pattern.fromData({
    key,
    name: 'Couplet+',
    chords: '| G | G | G | G | G | G | F#m | Em |',
    fretboard,
})

const R1 = Pattern.fromData({
    key,
    name: 'Refrain (1/2)',
    chords: '| B Bb | A D |',
    fretboard,
})

const R2 = Pattern.fromData({
    key,
    name: 'Refrain (2/2)',
    chords: '| B | Bb | A | D |',
    fretboard,
})

const intro = new Section('Intro', [I, If])
const interlude = new Section('Interlude', [I])
const demiInterlude = new Section('Demi-interlude', [I2])
const couplet = new Section('Couplet', [C, C])
const coupletP = new Section('Couplet+', [C, Cp])
const refrain = new Section('Refrain', [R1, R1, R2])
const solo = new Section('Solo', [R1, R1])
const demiRefrain = new Section('Demi-refrain', [R2])

const parts: Part[] = [
    new Part('1', [intro, couplet, refrain]),
    new Part('2', [interlude, coupletP, refrain]),
    new Part('3', [interlude, couplet, refrain]),
    new Part('4', [interlude, solo, demiRefrain, demiInterlude, demiRefrain]),
]

const structure = Structure.builder()
    .parts(parts)
    .build()

const recording = Recording.builder()
    .initData(recordingInitData)
    .build()

export default {
    name: 'Tout foufou',
    structure,
    recording,
}    
