import {RecordingMapper} from "./recording-mapper.service";
import {RecordingDto} from "../../recording/recording-dto";
import {Midi} from "../../recording/recording";

describe('RecordingMapper', () => {

    const recordingMapper = new RecordingMapper();

    describe(`model`, () => {

        const fullDto: RecordingDto = {
            name: "dto.name",
            sampleDurationInSeconds: 60,
            warpMarkers: [
                {secTime: 0, beatTime: -1.1762159715284715},
                {secTime: 197.84312565104167, beatTime: 360.35486076423575},
            ],
            midi: {
                header: {
                    ppq: 480,
                    timeSignatures: [{
                        "ticks": 0,
                        "timeSignature": [
                            4,
                            4
                        ],
                        "measures": 0
                    }]
                },
                tracks: []
            },
            musicXmlString: "<?xml ?><!-- DTO -->",
        }
        const standaloneMidi: Midi = {
            header: {
                ppq: 96,
                timeSignatures: [{
                    "ticks": 96,
                    "timeSignature": [
                        4,
                        4
                    ],
                    "measures": 0
                }]
            },
            tracks: []
        }
        const standaloneMusicXmlString = "<?xml ?><!-- STANDALONE -->"

        const errorMessageSuffix = ` défini deux fois pour l'enregistrement "dto.name"`

        type ModelParams = [boolean, boolean, boolean, string | undefined];
        (
            [
                [false, false, false, undefined],
                [false, false, true, undefined],
                [false, true, false, undefined],
                [false, true, true, undefined],
                [true, false, false, undefined],
                [true, false, true, "MusicXmlString" + errorMessageSuffix],
                [true, true, false, "Midi" + errorMessageSuffix],
                [true, true, true, "Midi" + errorMessageSuffix],
            ] as ModelParams[]
        ).forEach(([dtoIsFull, withStandaloneMidi, withStandaloneMusicXmlString, expectedError]) => {

            it(`Should map model from dto(${dtoIsFull}, ${withStandaloneMidi}, ${withStandaloneMusicXmlString})`, () => {

                try {
                    const dto = dtoIsFull ? fullDto : {
                        ...fullDto,
                        midi: undefined,
                        musicXmlString: undefined,
                    };
                    const recording = recordingMapper.model(
                        dto,
                        withStandaloneMidi ? standaloneMidi : undefined,
                        withStandaloneMusicXmlString ? standaloneMusicXmlString : undefined
                    );
                    if (expectedError) fail(`Erreur attendue`);

                    expect(recording.midi).toBe(withStandaloneMidi ? standaloneMidi : dto.midi);
                    expect(recording.musicXmlString).toBe(withStandaloneMusicXmlString ? standaloneMusicXmlString : dto.musicXmlString);
                } catch (e) {
                    if (expectedError) {
                        expect((e as Error).message).toEqual(expectedError);
                    } else {
                        fail(e)
                    }
                }

            })

        })

    })

});
