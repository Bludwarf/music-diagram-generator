import {Structure} from "./structure";

describe('Structure', () => {

  it('should get first warp position', async () => {
    const structure = Structure.builder()
      .stuctureObject({
          "sampleDuration": 208,
          "sampleBeatTimeDuration": 380,
          "warpMarkers": [
            {
              "secTime": 0,
              "beatTime": -1.1762159715284715
            },
            {
              "secTime": 197.84312565104167,
              "beatTime": 360.35486076423575
            }
          ]
        }
      )
      .patterns([])
      .build()
    expect(structure.getWarpPosition(0)?.toAbletonLiveBarsBeatsSixteenths()).toBe('0.-1.1')
  });

  it('should get last warp position', async () => {
    const structure = Structure.builder()
      .stuctureObject({
          "sampleDuration": 208,
          "sampleBeatTimeDuration": 380,
          "warpMarkers": [
            {
              "secTime": 0,
              "beatTime": -1.1762159715284715
            },
            {
              "secTime": 197.84312565104167,
              "beatTime": 360.35486076423575
            }
          ]
        }
      )
      .patterns([])
      .build()
    expect(structure.getWarpPosition(197.84312565104167)?.toAbletonLiveBarsBeatsSixteenths()).toBe('91.1.2')
  });

  it('should get sample duration warp position', async () => {
    const sampleDuration = 208
    const structure = Structure.builder()
      .stuctureObject({
          sampleDuration,
        "sampleBeatTimeDuration": 380,
          "warpMarkers": [
            {
              "secTime": 0,
              "beatTime": -1.1762159715284715
            },
            {
              "secTime": 197.84312565104167,
              "beatTime": 360.35486076423575
            }
          ]
        }
      )
      .patterns([])
      .build()
    expect(structure.getWarpPosition(sampleDuration)?.toAbletonLiveBarsBeatsSixteenths()).toBe('96.1.1')
  });

});
