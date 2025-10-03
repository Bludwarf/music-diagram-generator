import {Structure} from "../../structure/structure";
import {Part} from "../../structure/part/part";
import {Recording} from "../../recording/recording";
import recordingInitData from "../../../assets/recordings/07 - If You Really See Eurydice.json";
import {Section} from "../../structure/section/section";
import {Pattern, PatternInitData} from "../../structure/pattern/pattern";
import {SongEntry} from "../song-entry";
import {AbletonLive10Color} from "../../color";
import {RythmBarEvent} from "../../rythm-bar/event";
import eventsMDJson from "../../../assets/events/The Sims - If You Really See Eurydice/theme1-main-droite.events.json";
import eventsMidiJson from "../../../assets/events/The Sims - If You Really See Eurydice/theme1.gp.mid.json";
import {Time} from "../../time";
import {Key} from "../../notes";

const eventsMG = RythmBarEvent.fromEach(getEventsFromMidiNotes("kick", eventsMidiJson.tracks[1].notes))
const eventsMD = RythmBarEvent.fromEach(eventsMDJson)

/////////////////////////////////////////////////////////
// Patterns /////////////////////////////////////////////
/////////////////////////////////////////////////////////

function getPatterns(letter: string, offset: number, dataDeltas: Partial<PatternInitData>[]): Pattern[] {
  return dataDeltas
    .map((dataDelta, i) => ({
      key: Key.C,
      color: AbletonLive10Color.fromIndex(32),
      name: 'Thème1' + letter + (i + 1),
      events: getEvents(offset + 2 * i),
      ...dataDelta,
    }))
    .map(data => Pattern.fromData(data));
}

function getEvents(offset: number) {
  return eventsMG
    .filter((event: any) => event.bar >= 1 && event.bar <= 2)
    .map(event => ({
      ...event,
      bar: event.bar + offset,
    }))
    .concat(
      eventsMD.filter((event: any) => event.bar >= 1 + offset && event.bar <= 2 + offset)
    );
}

function getEventsFromMidiNotes(eventNote: string, notes: any) {
  return notes.map((note: any) => {
    const timeFields = Time.fromValue(note.time).toBarsBeatsSixteenthsOneBasedFields()
    return {
      "bar": timeFields.bars,
      "beat": timeFields.beats,
      "division": timeFields.sixteenths,
      "note": eventNote
    }
  });
}

const T1aPatterns = getPatterns('a', 0, [
  {
    chords: '| C5 | C |',
  },
  {
    chords: '| C5 | G(no5)/C |',
  },
  {
    chords: '| C6 | C5 |',
  },
  {
    chords: '| C | C7M |',
  },
]);

const T1bPatterns = getPatterns('b', 8, [
  {
    chords: '| C5 | C |',
  },
  {
    chords: '| C5 | G(no5)/C |',
  },
  {
    chords: '| C6 | C5 |',
  },
  {
    chords: '| C | C7M |',
  },
]);

const T1cPatterns = getPatterns('c', 16, [
  {
    chords: '| C5 | C |',
  },
  {
    chords: '| C5 | G(no5)/C |',
  },
  {
    chords: '| C6 | C5 |',
  },
  {
    chords: '| C | C7M |',
  },
]);

const T2 = Pattern.fromData({
  // key: Key.Cm,
  name: 'Thème 2',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '2m',
  color: AbletonLive10Color.fromIndex(1),
})
const P = Pattern.fromData({
  // key: Key.Cm,
  name: 'Pont',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '11m',
  color: AbletonLive10Color.fromIndex(39),
})
const F = Pattern.fromData({
  // key: Key.Cm,
  name: 'Fin',
  // chords: '| Cm | Gm | Bb | F |',
  duration: '6m', // On avait identifié 7m sur Live, programmé 11 dans le ts, mais Jack Long sur MuseScore en transcrit 6
  color: AbletonLive10Color.fromIndex(23),
})

/////////////////////////////////////////////////////////
// Sections /////////////////////////////////////////////
/////////////////////////////////////////////////////////

const theme1 = new Section('Thème 1a', T1aPatterns)
const theme1b = new Section('Thème 1b', T1bPatterns)
const theme1t = new Section('Thème 1c', T1cPatterns)
const theme2 = new Section('Thème 2', T2.times(8))
const pont = new Section('Pont', P.times(1))
const fin = new Section('Fin', F.times(1))

/////////////////////////////////////////////////////////
// Export ///////////////////////////////////////////////
/////////////////////////////////////////////////////////

export default {
  name: 'The Sims - If You Really See Eurydice',
  structure: Structure.builder()
    .parts([
      new Part('1', [theme1, theme1b, theme1t]),
      new Part('2', [theme2, pont]),
      new Part('3', [theme1, theme1b, theme1t, fin]),
    ])
    .getEventsStartTime((pattern: Pattern) => {
      const patternGroups = [
        T1aPatterns,
        T1bPatterns,
        T1cPatterns,
      ];
      for (let i = 0; i < patternGroups.length; i++) {
        const T1xPatterns = patternGroups[i];
        for (let j = 0; j < T1xPatterns.length; j++) {
          const T1xPattern = T1xPatterns[j];
          if (pattern === T1xPattern) return Time.fromBar(i * 8 + j * 2)
        }
      }
      return undefined
    })
    .getEventsDurationInBars((pattern: Pattern) => pattern.duration.toBars())
    .build(),
  recording: Recording.builder()
    .initData(recordingInitData)
    .midi(eventsMidiJson)
    .build(),
} as SongEntry
