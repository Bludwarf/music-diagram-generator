import {Key} from "../../notes";
import recordingInitData from "../../../assets/recordings/DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01.json";
import {Position} from "../../time";
import {RythmBarEvent} from "../../rythm-bar/event";
import eventsJson from '../../../assets/events/Petit Papillon/events.json';
import {Pattern} from "../../structure/pattern/pattern";
import {Recording} from "../../recording/recording";
import {Structure} from "../../structure/structure";
import {Section} from "../../structure/section/section";
import {Part} from "../../structure/part/part";
import {BLUE, GREEN, RED} from "../../color";


// On utilise pour l'instant le fichier DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01.wav

const events = RythmBarEvent.fromEach(eventsJson)
const key = Key.Gm
const fretboard = {
  lowestFret: 0,
  fretsCount: 7,
}

const bombardeSeuleIntro = Pattern.fromData({
  name: 'Début bombarde (G à 4.4)',
  initial: 'B0',
  key,
  durationInBars: 4,
  fretboard,
})
const bombarde = Pattern.fromData({
  name: 'Partie bombarde',
  initial: 'B',
  key,
  chords: '| Gm F | Eb D | Gm F | Eb D Gm Gm |',
  fretboard,
  events: events.filter((event: any) => event.bar >= 1 && event.bar <= 2),
  color: GREEN,
})
const bombardeSeuleM1 = Pattern.fromData({
  name: 'Bombarde seule',
  initial: 'B*1',
  durationInBars: 1, // TODO on devrait pouvoir faire plutôt : chords: '|  | Eb D |'
  key,
  fretboard,
  color: RED,
})
const bombardeSeuleM2 = Pattern.fromData({
  name: 'Retour groupe',
  initial: 'B*2',
  chords: '| Eb D |',
  key,
  fretboard,
  events: events.filter((event: any) => event.bar == 2),
  color: bombarde.color,
})
const bombardeM3et4 = Pattern.fromData({
  name: '1/2 Partie bombarde',
  initial: 'B*34',
  key,
  chords: '| Gm F | Eb D Gm Gm |',
  fretboard,
  events: events.filter((event: any) => event.bar >= 1 && event.bar <= 2),
  color: bombarde.color,
})
const couplet = Pattern.fromData({
  name: 'Couplet',
  key,
  chords: '| Gm F | Eb D | Gm F | Eb D Gm Gm |',
  fretboard,
  events: events.filter((event: any) => event.bar >= 3 && event.bar <= 4),
})
const coupletBb = Pattern.fromData({
  name: 'Couplet (Bb)',
  initial: 'C\'',
  key,
  chords: '| Gm F | Eb Bb | Gm F | Eb D Gm Gm |',
  fretboard,
  events: events.filter((event: any) => event.bar >= 3 && event.bar <= 4),
})
const refrain = Pattern.fromData({
  name: 'Refrain',
  durationInBars: 4,
  key,
  chords: '| Bb | F | C | Gm |',
  fretboard,
  events: events.filter((event: any) => event.bar >= 5),
})

const intro = new Section('Intro', [bombardeSeuleIntro, bombarde, bombarde])
const bombardePassage = new Section('Bombarde', [bombarde, bombarde], undefined, BLUE)
const bombardePassageApresRefrain = new Section('Bombarde', [bombardeSeuleM1, bombardeSeuleM2, bombardeM3et4, bombarde], 'Ba')
const coupletPassage = new Section('Couplet', [couplet, coupletBb])
const refrainPassage = new Section('Refrain', [refrain, refrain])

const parts: Part[] = [
  new Part('Intro', [
    intro,
  ]),
  new Part('1', [
    coupletPassage,
    bombardePassage,
    coupletPassage,
    refrainPassage,
    bombardePassageApresRefrain
  ]),
  new Part('2', [
    coupletPassage,
    bombardePassage,
    coupletPassage,
    refrainPassage,
    bombardePassageApresRefrain
  ]),
]

const structure = Structure.builder()
  .parts(parts)
  .getEventsStartPosition((pattern: Pattern) => {
    if (pattern === bombarde) return new Position(0)
    if (pattern === bombardeM3et4) return new Position(0)
    if (pattern === bombardeSeuleM2) return new Position(1)
    if (pattern === couplet) return new Position(2)
    if (pattern === coupletBb) return new Position(2)
    if (pattern === refrain) return new Position(4)
    return undefined
  })
  .getEventsDurationInBars((pattern: Pattern) => {
    if (pattern === bombarde) return 2
    if (pattern === bombardeM3et4) return 2
    if (pattern === bombardeSeuleM2) return 1
    if (pattern === couplet) return 2
    if (pattern === coupletBb) return 2
    if (pattern === refrain) return 4
    return undefined
  })
  .build()

const recording = Recording.builder()
  .initData(recordingInitData)
  .build()

export default {
  name: 'Petit Papillon',
  version: 'Album',
  structure,
  recording,
}
