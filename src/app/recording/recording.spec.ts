import {Recording} from "./recording";
import {Time} from "../time";
import * as Tone from "tone";

const ORIGINAL_PPQ = Tone.Transport.PPQ;
const ORIGINAL_BPM_VALUE = Tone.Transport.bpm.value;

describe('Recording', () => {

  afterEach(() => {
    Tone.Transport.PPQ = ORIGINAL_PPQ;
    Tone.Transport.bpm.value = ORIGINAL_BPM_VALUE;
  });

  it('should get first warp position', async () => {
    const recording = Recording.builder()
      .initData({
          name: 'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
          sampleDuration: 208,
          sampleBeatTimeDuration: 378.36283820346318 - -1.1762159715284715,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: -1.1762159715284715
            },
            {
              secTime: 197.84312565104167,
              beatTime: 360.35486076423575
            }
          ]
        }
      )
      .build()
    expect(recording.getWarpPosition(0)?.toAbletonLiveBarsBeatsSixteenths()).toBe('0.-1.1')
  });

  it('should get last warp position', async () => {
    const recording = Recording.builder()
      .initData({
          name: 'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
          sampleDuration: 208,
          sampleBeatTimeDuration: 378.36283820346318 - -1.1762159715284715,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: -1.1762159715284715
            },
            {
              secTime: 197.84312565104167,
              beatTime: 360.35486076423575
            }
          ]
        }
      )
      .build()
    expect(recording.getWarpPosition(197.84312565104167)?.toAbletonLiveBarsBeatsSixteenths()).toBe('91.1.2')
  });

  it('should get sample duration warp position', async () => {
    const sampleDuration = 208
    const recording = Recording.builder()
      .initData({
          name: 'DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01',
          sampleDuration,
          sampleBeatTimeDuration: 378.36283820346318 - -1.1762159715284715,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: -1.1762159715284715
            },
            {
              secTime: 197.84312565104167,
              beatTime: 360.35486076423575
            }
          ]
        }
      )
      .build()
    expect(recording.getWarpPosition(sampleDuration)?.toAbletonLiveBarsBeatsSixteenths()).toBe('95.3.2') // En utilisant sampleBeatTimeDuration au lieu de sampleEndBeatTime on trouve '95.4.3'
  });

  it('should get last chord position in Elle rêve à quoi', async () => {
    const recording = Recording.builder()
      .initData({
          name: "ELLE REVE preview brut_01",
          sampleDuration: 236.669375,
          sampleBeatTimeDuration: 608.7926032301033,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: -11.438887414668665
            },
            {
              secTime: 221.33526285807292,
              beatTime: 556.1785269418082
            }
          ]
        }
      )
      .build()
    const lastChordSecTime = 3 * 60 + 44.275
    expect(recording.getWarpPosition(lastChordSecTime)?.toAbletonLiveBarsBeatsSixteenths()).toBe('142.1.1') // En utilisant sampleBeatTimeDuration au lieu de sampleEndBeatTime on trouve '142.3.2'
  });

  it('should get tempo from simple recording', async () => {
    const recording = Recording.builder()
      .initData({
          name: "Simple recording",
          sampleDuration: 236.669375,
          sampleBeatTimeDuration: 608.7926032301033,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: 0,
            },
            {
              secTime: 60, // 1 min
              beatTime: 120, // 120 BPM
            }
          ]
        }
      )
      .build()
    expect(recording.meanTempo).toBe(120)
  });

  it('should get tempo from two regioned recording', async () => {
    const recording = Recording.builder()
      .initData({
          name: "Simple recording",
          sampleDuration: 236.669375,
          sampleBeatTimeDuration: 608.7926032301033,
          warpMarkers: [
            {
              secTime: 0,
              beatTime: 0,
            },
            {
              secTime: 60, // 1 min
              beatTime: 120, // 120 BPM
            },
            {
              secTime: 60 + 30, // + 30 s
              beatTime: 120 + 120, // 240 BPM
            }
          ]
        }
      )
      .build()
    expect(recording.meanTempo).toBe(160)
  });

  it('should get warpTime', async () => {
    const recording = Recording.builder()
      .initData({
          name: "07 - If You Really See Eurydice",
          sampleDuration: 222.4272335600907,
          sampleBeatTimeDuration: 331.4358253725441,
          warpMarkers: [
            {
              "secTime": 22.42859410430839,
              "beatTime": 32
            },
            {
              "secTime": 27.76201814058957,
              "beatTime": 40
            }
          ]
        }
      )
      .build()
    Tone.Transport.PPQ = 480;
    const ticks = 16080;
    const durationTicks = 119;
    expect(recording.getWarpedTime(Time.fromTicks(ticks))?.toTicks()).toEqual(22491)
    expect(recording.getWarpedTime(Time.fromTicks(ticks + durationTicks))?.toTicks()).toEqual(22650)
  });

});
