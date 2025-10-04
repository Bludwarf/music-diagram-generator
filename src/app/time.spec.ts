import {Time} from "./time";
import * as Tone from "tone";

const ORIGINAL_PPQ = Tone.Transport.PPQ;
const ORIGINAL_BPM_VALUE = Tone.Transport.bpm.value;

describe('Time', () => {

  afterEach(() => {
    Tone.Transport.PPQ = ORIGINAL_PPQ;
    Tone.Transport.bpm.value = ORIGINAL_BPM_VALUE;
  });

  it('should get duration in bars of 1m', () => {
    const duration = Time.fromValue('1m')
    expect(duration.toBars()).toBe(1)
  });

  it('should get duration in bars of 4m', () => {
    const duration = Time.fromValue('4m')
    expect(duration.toBars()).toBe(4)
  });

  it('should get duration from ticks', () => {
    Tone.Transport.PPQ = 480;
    expect(Time.fromTicks(Tone.Transport.PPQ).toSeconds()).toEqual(0.5)
    expect(Time.fromTicks(Tone.Transport.PPQ, 480).toSeconds()).toEqual(0.5)
    Tone.Transport.PPQ = 240;
    expect(Time.fromTicks(Tone.Transport.PPQ).toSeconds()).toEqual(0.5)
    expect(Time.fromTicks(Tone.Transport.PPQ, 480).toSeconds()).toEqual(0.25)
    Tone.Transport.bpm.value = 120;
    expect(Time.fromTicks(Tone.Transport.PPQ).toSeconds()).toEqual(0.5)
    expect(Time.fromTicks(Tone.Transport.PPQ, 480).toSeconds()).toEqual(0.25)
    Tone.Transport.bpm.value = 60;
    expect(Time.fromTicks(Tone.Transport.PPQ).toSeconds()).toEqual(1)
    expect(Time.fromTicks(Tone.Transport.PPQ, 480).toSeconds()).toEqual(0.5)
  });

  it('should get duration in ticks', () => {
    expect(Time.fromTicks(480).toTicks()).toEqual(480)
  });

  it('should compute 1m + 1m', () => {
    const sum = Time.fromValue('1m').add(Time.fromValue('1m'))
    expect(sum.toBarsBeatsSixteenths()).toBe('2:0:0')
  });

  it('should compute 2n + 2n', () => {
    const sum = Time.fromValue('2n').add(Time.fromValue('2n'))
    expect(sum.toBarsBeatsSixteenths()).toBe('1:0:0')
  });

});
