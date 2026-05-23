import {Recording} from "./recording";
import {BeatTime, SecTime} from "../time";
import {Transport} from "tone";

const ORIGINAL_PPQ = Transport.PPQ;
const ORIGINAL_BPM_VALUE = Transport.bpm.value;

describe('Recording', () => {

    afterEach(() => {
        Transport.PPQ = ORIGINAL_PPQ;
        Transport.bpm.value = ORIGINAL_BPM_VALUE;
    });

    function testGetWarpPosition(recording: Recording, secTimeValue: number, expectedBeatTimeValue: number) {
        const beatTime = recording.getBeatTime(new SecTime(secTimeValue));
        expect(beatTime).toEqual(new BeatTime(expectedBeatTimeValue));
    }

    const relativeBeatTimeJsRounded = 378.9151504258818 // valeur exacte : 378.36283820346318
    it('should get first warp position', async () => {
        const recording = new Recording(
            'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
            208,
            [
                {secTime: 0, beatTime: -1.1762159715284715},
                {secTime: 197.84312565104167, beatTime: 360.35486076423575},
            ]);
        testGetWarpPosition(recording, 0, -1.1762159715284715);
    });

    it('should get last warp position', async () => {
        const recording = new Recording(
            'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
            208,
            [
                {secTime: 0, beatTime: -1.1762159715284715},
                {secTime: 197.84312565104167, beatTime: 360.35486076423575},
            ]);
        testGetWarpPosition(recording, 197.84312565104167, 360.35486076423575);
    });

    it('should get sample duration warp position', async () => {
        const sampleDuration = 208
        const recording = new Recording(
            'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
            sampleDuration,
            [
                {secTime: 0, beatTime: -1.1762159715284715},
                {secTime: 197.84312565104167, beatTime: 360.35486076423575},
            ])
        testGetWarpPosition(recording, sampleDuration, relativeBeatTimeJsRounded);
    });

    it('should get sample duration warp position even with few WarpMarkers', async () => {
        const sampleDuration = 319.76723356009069
        // <WarpMarker Id="9" SecTime="319.76723356009069" BeatTime="534.23802941849817" />
        // Dernier WarpMarker ajouté manuellement dans Live, sur la fin de la forme d'onde (dernière position cliquable)
        const recording = new Recording(
            "Michael Jackson - 07 - Man In The Mirror",
            sampleDuration,
            [
                {secTime: 0.2882086167800453, beatTime: 0},
                {secTime: 6.771950113378685, beatTime: 10.8422181984682},
                {secTime: 6.790637887334485, beatTime: 10.8734681984682},
            ],
        )
        testGetWarpPosition(recording, sampleDuration, 534.2380293230831); // Live calcule 534.23802941849817 mais on est pas mal
    });

    it('should get last chord position in Elle rêve à quoi', async () => {
        const recording = new Recording(
            "ELLE REVE preview brut_01",
            236.669375,
            [
                {secTime: 0, beatTime: -11.438887414668665},
                {secTime: 221.33526285807292, beatTime: 556.1785269418082},
            ])
        const lastChordSecTime = 3 * 60 + 44.275
        testGetWarpPosition(recording, lastChordSecTime, 563.7175244510227);
    });

    it('should get tempo from simple recording', async () => {
        const recording = new Recording(
            "Simple recording",
            236.669375,
            [
                {secTime: 0, beatTime: 0,},
                {secTime: 60, beatTime: 120,}, // 1 min | 120 BPM
            ])
        expect(recording.meanTempo).toBe(120)
    });

    it('should get tempo from two regioned recording', async () => {
        const recording = new Recording(
            "Simple recording",
            236.669375,
            [
                {secTime: 0, beatTime: 0,},
                {secTime: 60, beatTime: 120,}, // 1 min | 120 BPM
                {secTime: 60 + 30, beatTime: 120 + 120,}, // 1 min 30 s | 240 BPM
            ])
        expect(recording.meanTempo).toBe(160)
    });

    it('getSecTime', async () => {
        const recording = new Recording(
            "07 - If You Really See Eurydice",
            222.4272335600907,
            [
                {secTime: 22.42859410430839, beatTime: 32},
                {secTime: 27.76201814058957, beatTime: 40},
            ])
        const ppq = 480;
        const ticks = 16080;
        const durationTicks = 119;
        expect(recording.getSecTime(BeatTime.fromMidiTicks(ticks, ppq))).toEqual(new SecTime(23.428611111111113))
        expect(recording.getSecTime(BeatTime.fromMidiTicks(ticks + durationTicks, ppq))).toEqual(new SecTime(23.59389169973545))
    });

    it('getSecTime/getBeatTime before first WarpMarker', async () => {
        const recording = new Recording(
            "07 - If You Really See Eurydice",
            222.4272335600907,
            [
                {secTime: 22.42859410430839, beatTime: 32},
                {secTime: 27.76201814058957, beatTime: 40},
            ])
        const beatTime = new BeatTime(0);
        const secTime = recording.getSecTime(beatTime);
        expect(secTime).toBeDefined();
        expect(recording.getBeatTime(secTime!)).toEqual(beatTime);
    });

    it('getSecTime/getBeatTime after last WarpMarker', async () => {
        const recording = new Recording(
            "07 - If You Really See Eurydice",
            222.4272335600907,
            [
                {secTime: 22.42859410430839, beatTime: 32},
                {secTime: 27.76201814058957, beatTime: 40},
            ])
        const beatTime = new BeatTime(40);
        const secTime = recording.getSecTime(beatTime);
        expect(secTime).toBeDefined();
        expect(recording.getBeatTime(secTime!)).toEqual(beatTime);
    });

    // TODO getSecTime avec changements de signature rythmique
    // TODO getSecTimeAt

});
