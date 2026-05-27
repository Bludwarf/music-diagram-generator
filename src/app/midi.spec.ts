import {MidiTimeSignature, MidiWrapper} from "./midi";
import {TimeSignature} from "./time";

const ppq = 480;

describe("MidiWrapper", () => {

    const timeSignatures: MidiTimeSignature[] = [
        {
            ticks: 0,
            timeSignature: [
                4,
                4
            ],
            measures: 0
        },
        {
            ticks: 88320,
            timeSignature: [
                3,
                4
            ],
            measures: 46
        },
        {
            ticks: 89760,
            timeSignature: [
                4,
                4
            ],
            measures: 47
        },
        {
            ticks: 91680,
            timeSignature: [
                3,
                4
            ],
            measures: 48
        },
        {
            ticks: 93120,
            timeSignature: [
                4,
                4
            ],
            measures: 49
        },
        {
            ticks: 95040,
            timeSignature: [
                3,
                4
            ],
            measures: 50
        },
        {
            ticks: 96480,
            timeSignature: [
                4,
                4
            ],
            measures: 51
        }
    ]

    describe("getTimeSignature", () => {

        ([
            [0, 0, [4, 4]],
            [88320, 46, [3, 4]],
            [89760, 47, [4, 4]],
            [91680, 48, [3, 4]],
            [93120, 49, [4, 4]],
            [95040, 50, [3, 4]],
            [96480, 51, [4, 4]],
            [190080, 100, [4, 4]],
        ] as ([number, number, TimeSignature])[]).forEach(([ticks, measures, expectedTimeSignature]) => {
            it(`ticks ${ticks} / measure ${measures}`, () => {
                const midiWrapper = new MidiWrapper({
                    header: {
                        ppq,
                        timeSignatures,
                    },
                    tracks: []
                });
                const fromTicks = midiWrapper.getTimeSignature("ticks", ticks);
                const fromMeasures = midiWrapper.getTimeSignature("measures", measures);
                expect(fromTicks).toBe(fromMeasures)
                expect(fromTicks.timeSignature).toEqual(expectedTimeSignature)
            });
        });

    });

});
