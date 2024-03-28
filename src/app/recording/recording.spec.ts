import {Recording} from "./recording";

describe('Recording', () => {

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
    expect(recording.getWarpPosition(sampleDuration)?.toAbletonLiveBarsBeatsSixteenths()).toBe('95.4.3')
  });

});
