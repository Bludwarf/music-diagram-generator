
import { Key } from "../../notes";
import recordingInitData from "../../../assets/recordings/SOLITUDE preview.json";
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

const CData = {
    key,
    name: 'Couplet',
    chords: '| Gm Dm | Gm Dm | Eb Bb | Cm Dm Gm Gm |',
    fretboard,
};
const C = Pattern.fromData(CData)

const R = Pattern.fromData({
    key,
    name: 'Refrain',
    chords: '| Dm Eb | Bb Dm |',
    fretboard,
})

const B = Pattern.fromData({
    key,
    name: 'Break',
    chords: '| Gm | Gm | Gm | Gm |',
    fretboard,
})

const F = Pattern.fromData({
    ...CData,
    name: 'Final', // TODO notation pour indiquer que les pêches de la fin : 1 2 3 o)))
})

const intro = new Section('Intro guitare', [C])
const bombarde = new Section('Bombarde', [C, C])
const couplet = new Section('Couplet', [C, C])
const refrain = new Section('Refrain', [R, R])
const breakSection = new Section('Break', [B, B, B, B])
const bombardeFinal = new Section('Bombarde', [C, F])

const parts: Part[] = [
    new Part('I', [intro]),
    new Part('1', [bombarde, couplet, bombarde, couplet, refrain]),
    new Part('2', [bombarde, couplet, bombarde, couplet, refrain]),
    new Part('Bk', [breakSection]),
    new Part('F', [bombarde, bombarde, bombarde, bombardeFinal]),
]

const structure = Structure.builder()
    .parts(parts)
    .build()

const recording = Recording.builder()
    .initData(recordingInitData)
    .build()

export default {
    name: 'Solitude',
    structure,
    recording,
}    
