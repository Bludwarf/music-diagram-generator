import {Midi} from "./midi";
import {BarNumber0Indexed} from "./notes";
import {Pattern} from "./structure/pattern/pattern";
import {Structure} from "./structure/structure";
import {Part} from "./structure/part/part";
import {Section} from "./structure/section/section";
import {generateMidi} from "./midi-generator";

describe('MidiGenerator', () => {

    it(`generateMidi`, async () => {
        const expectedMidi: Midi = {
            header: {
                ppq: 24,
                timeSignatures: [
                    {
                        ticks: 0,
                        timeSignature: [
                            3,
                            4,
                        ],
                        measures: 0,
                    },
                    {
                        ticks: 72,
                        timeSignature: [
                            4,
                            4,
                        ],
                        measures: 1,
                    },
                    {
                        ticks: 168,
                        timeSignature: [
                            3,
                            4,
                        ],
                        measures: 2,
                    },
                    {
                        ticks: 240,
                        timeSignature: [
                            4,
                            4,
                        ],
                        measures: 3,
                    },
                    {
                        ticks: 336,
                        timeSignature: [
                            3,
                            4,
                        ],
                        measures: 4,
                    },
                    {
                        ticks: 408,
                        timeSignature: [
                            4,
                            4,
                        ],
                        measures: 5,
                    },
                ],
            },
            tracks: [],
        };

        function newPattern(barNumber: BarNumber0Indexed, beats: number) {
            return new Pattern(`bar${barNumber}`, 1, barNumber + "", undefined, undefined, undefined, undefined, undefined, [beats, 4])
        }

        const structure = new Structure([
            new Part("1", [
                new Section("Section 1", [
                    newPattern(0, 3),
                    newPattern(1, 4),
                ]),
                new Section("Section 2", [
                    newPattern(2, 3),
                    newPattern(3, 4),
                ]),
            ]),
            new Part("2", [
                new Section("Section 3", [
                    newPattern(4, 3),
                    newPattern(5, 4),
                ]),
            ]),
        ], undefined, undefined, undefined, undefined)
        expect(generateMidi(structure, [4, 4])).toEqual(expectedMidi);
    });

});
