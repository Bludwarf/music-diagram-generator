import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Section} from "../../structure/section/section";
import {Pattern} from "../../structure/pattern/pattern";
import {Key} from "../../notes";
import {SongEntry} from "../song-entry";
import {BLACK, BLUE} from "../../color";

// ~ Melody Nelson

/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const CData = {
  key: Key.Fm,
  name: 'Couplet',
  chords: '| F | Ab | Eb | Eb |',
  fretboard: {
    lowestFret: 1,
    fretsCount: 6,
  },
};

const C = Pattern.fromData(CData)

const P = Pattern.fromData({
  ...CData,
  name: 'Pont',
  chords: '| Bb | Bb | F | F | Bb | Bb | C# | C# | F | F |',
})


/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const instru = new Section('Instru', [C, C, C], undefined, BLUE);
const coupletFr1 = new Section('Couplet fr', [C, C])
const coupletFr = new Section('fr', [C, C])
const coupletBzh = new Section('bzh', [C, C], undefined, BLACK)
const pont = new Section('Pont', [P])
const instruF = new Section('Instru final', [C, C, C, C, C, C, C, C], undefined, BLUE);

/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'Aucun respect',
  structure: Structure.builder()
    .parts([
      new Part('I', [
        new Section('Intro guitare', [C, C]),
        instru,
      ]),
      new Part('1', [coupletFr1, coupletBzh, coupletFr, coupletBzh, instru]),
      new Part('2', [coupletFr1, coupletBzh, coupletFr, coupletBzh, pont, instru]),
      new Part('3', [coupletFr1, coupletBzh, coupletFr, coupletBzh, instru]),
      new Part('3', [
        new Section('Couplet fr', [C, C, C, C]),
        new Section('bzh', [C, C, C, C], undefined, BLACK),
        instru,
        new Section('Solo Guitare', [P])]),
      new Part('4', [pont, instruF]),
    ])
    .build(),
} as SongEntry
