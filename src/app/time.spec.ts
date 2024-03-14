import { Time } from "./time";

describe('Time', () => {

    it('should get duration in bars of 1m', () => {
        const duration = Time.fromValue('1m')
        expect(duration.toBars()).toBe(1)
    });

    it('should get duration in bars of 4m', () => {
        const duration = Time.fromValue('4m')
        expect(duration.toBars()).toBe(4)
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
