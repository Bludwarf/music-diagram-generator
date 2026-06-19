import {addBarsToTicks, Midi, MidiTimeSignature} from "./midi";
import {TimeSignature} from "./time";
import {Structure} from "./structure/structure";

const DEFAULT_MIDI_PPQ: number = 24; // cf. https://en.wikipedia.org/wiki/MIDI_beat_clock#Pulses_per_quarter_note

export function generateMidi(structure: Structure, defaultTimeSignature: TimeSignature): Midi {
    return {
        header: {
            ppq: DEFAULT_MIDI_PPQ,
            timeSignatures: generateMidiTimeSignatures(structure, defaultTimeSignature),
        },
        tracks: [],
    }
}

function generateMidiTimeSignatures(structure: Structure, defaultTimeSignature: TimeSignature): MidiTimeSignature[] {
    const midiTimeSignatures: MidiTimeSignature[] = [];
    let ticks = 0;
    let timeSignature: TimeSignature = defaultTimeSignature;
    for (const partInStructure of structure.partsInStructure) {
        for (const sectionInStructure of partInStructure.sectionsInStructure) {
            for (const patternInStructure of sectionInStructure.patternsInStructure) {
                if (patternInStructure.pattern.timeSignature && patternInStructure.pattern.timeSignature !== timeSignature) {
                    timeSignature = patternInStructure.pattern.timeSignature;
                    midiTimeSignatures.push({
                        measures: patternInStructure.startPosition.bars,
                        ticks,
                        timeSignature,
                    });
                }
                ticks = addBarsToTicks(ticks, patternInStructure.pattern.durationInBars, timeSignature, DEFAULT_MIDI_PPQ);
            }
        }
    }
    return midiTimeSignatures;
}
