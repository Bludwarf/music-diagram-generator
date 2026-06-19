import {BeatTime, PositionFormatter} from "../time";
import {Midi} from "../midi";
import {Structure} from "./structure";

describe('Structure', () => {

    describe("getPosition from 4/4", () => {
        ([
            [0, "1.1.1"],
            [120, "31.1.1"],
            [120.25, "31.1.2"],
            [120.5, "31.1.3"],
            [120.75, "31.1.4"],
            [121, "31.2.1"],
        ] as [number, string][]).forEach(([beatTimeValue, expectedTimecode]) => {

            it(`4/4 @${beatTimeValue}`, async () => {
                const structure = new Structure([])
                const beatTime = new BeatTime(beatTimeValue);
                const position = structure.getPosition(beatTime);
                expect(PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position)).toEqual(expectedTimecode);
            });

        })
    })

    describe("getPosition from 6/8", () => {

        ([
            [657.0, "220.1.1"],
            [657.5, "220.2.1"],
            [658.0, "220.3.1"],
            [658.5, "220.4.1"],
            [659.0, "220.5.1"],
            [659.5, "220.6.1"],
            [660.0, "221.1.1"],
            [660.25, "221.1.2"],
        ] as [number, string][]).forEach(([beatTimeValue, expectedTimecode]) => {

            it(`6/8 @${beatTimeValue}`, async () => {
                const structure = new Structure([], undefined, undefined, [6, 8])
                const beatTime = new BeatTime(beatTimeValue);
                const position = structure.getPosition(beatTime);
                expect(PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position)).toEqual(expectedTimecode);
            });

        })

    })

    describe("getPosition from midi time signature", () => {
        ([
            [184, "47.1.1", 3],
            [187, "48.1.1", 4],
            [191, "49.1.1", 3],
            [194, "50.1.1", 4],
            [198, "51.1.1", 3],
            [201, "52.1.1", 4],
        ] as [number, string, number][]).forEach(([beatTimeValue, expectedTimecode, beatsPerBar]) => {

            it(`${beatsPerBar}/4 @${beatTimeValue}`, async () => {
                const midi: Midi = {
                    header: {
                        ppq: 480,
                        timeSignatures: [
                            {
                                ticks: 0,
                                timeSignature: [
                                    4,
                                    4,
                                ],
                                measures: 0,
                            },
                            {
                                ticks: 88320,
                                timeSignature: [
                                    3,
                                    4,
                                ],
                                measures: 46,
                            },
                            {
                                ticks: 89760,
                                timeSignature: [
                                    4,
                                    4,
                                ],
                                measures: 47,
                            },
                            {
                                ticks: 91680,
                                timeSignature: [
                                    3,
                                    4,
                                ],
                                measures: 48,
                            },
                            {
                                ticks: 93120,
                                timeSignature: [
                                    4,
                                    4,
                                ],
                                measures: 49,
                            },
                            {
                                ticks: 95040,
                                timeSignature: [
                                    3,
                                    4,
                                ],
                                measures: 50,
                            },
                            {
                                ticks: 96480,
                                timeSignature: [
                                    4,
                                    4,
                                ],
                                measures: 51,
                            },
                        ],
                    },
                    tracks: [],
                };
                const structure = new Structure([], undefined, undefined, [beatsPerBar, 4], midi)
                const beatTime = new BeatTime(beatTimeValue);
                const position = structure.getPosition(beatTime);
                expect(PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position)).toEqual(expectedTimecode);
            });

        })
    })

    describe("getPosition non arrondie", () => {

        ([
            [3.994, "1.4.4"],
            [3.995, "1.4.4"],
            [3.999999999, "1.4.4"],
        ] as [number, string][]).forEach(([beatTimeValue, expectedTimecode]) => {

            it(`${beatTimeValue}`, async () => {
                const structure = new Structure([])
                const beatTime = new BeatTime(beatTimeValue);
                const position = structure.getPosition(beatTime);
                expect(PositionFormatter.ABLETON_GLOBAL_TIMECODE.format(position)).toEqual(expectedTimecode);
            });

        })

    })

});
