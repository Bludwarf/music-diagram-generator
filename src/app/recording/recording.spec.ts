import {Recording} from "./recording";
import {Structure} from "../structure/structure";
import createSpyObj = jasmine.createSpyObj;

describe('Recording', () => {

  it('should get first warp position', async () => {
    const recording = Recording.builder()
      .structure(createSpyObj<Structure>(['sampleBeatTimeDuration'])) // TODO spy methodes
      .dto({
          "sampleDuration": 208,
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
      .build()
    expect(recording.getWarpPosition(0)?.toAbletonLiveBarsBeatsSixteenths()).toBe('0.-1.1')
  });

  it('should get last warp position', async () => {
    const recording = Recording.builder()
      .structure(createSpyObj<Structure>(['sampleBeatTimeDuration'])) // TODO spy methodes
      .dto({
          "sampleDuration": 208,
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
      .build()
    expect(recording.getWarpPosition(197.84312565104167)?.toAbletonLiveBarsBeatsSixteenths()).toBe('91.1.2')
  });

  it('should get sample duration warp position', async () => {
    const sampleDuration = 208
    const recording = Recording.builder()
      .structure(createSpyObj<Structure>(['sampleBeatTimeDuration'])) // TODO spy methodes
      .dto({
          sampleDuration,
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
      .build()
    expect(recording.getWarpPosition(sampleDuration)?.toAbletonLiveBarsBeatsSixteenths()).toBe('96.1.1')
  });

});
