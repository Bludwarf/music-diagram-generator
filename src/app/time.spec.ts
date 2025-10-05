import {BeatTime, Position, PositionedElement, PositionFormatter} from "./time";

describe('BeatTime', () => {

  it('fromMidiTicks()', () => {
    expect(BeatTime.fromMidiTicks(480, 480).value).toEqual(1)
    expect(BeatTime.fromMidiTicks(240, 480).value).toEqual(0.5)
  });

  it('toMidiTicks()', () => {
    expect(BeatTime.fromMidiTicks(480, 480).toMidiTicks(480)).toEqual(480)
    expect(BeatTime.fromMidiTicks(240, 480).toMidiTicks(480)).toEqual(240)
    expect(BeatTime.fromMidiTicks(240, 480).toMidiTicks(240)).toEqual(120)
  });

});

describe('Position', () => {

  it('should be constructed or not', () => {
    expect(new Position()).toEqual(new Position(0, 0, 0))
    expect(() => new Position(-1)).not.toThrowError()
    expect(() => new Position(0.5)).toThrowError(`bars should be an integer : 0.5`)
    expect(() => new Position(0, -1)).toThrowError(`beats should be positive : -1`)
    expect(() => new Position(0, 0.5)).toThrowError(`beats should be an integer : 0.5`)
    expect(() => new Position(0, 0, -1)).toThrowError(`sixteenths should be positive : -1`)
    expect(() => new Position(0, 0, 0.5)).not.toThrowError()
  });

  it('should add bars', () => {
    expect(new Position(0).addBars(0)).toEqual(new Position(0))
    expect(new Position(0).addBars(1)).toEqual(new Position(1))
    expect(new Position(1).addBars(-1)).toEqual(new Position(0))
    expect(new Position(0).addBars(-1)).toEqual(new Position(-1))
    expect(new Position(0, 1, 2.5).addBars(1)).toEqual(new Position(1, 1, 2.5))
    expect(() => new Position(1).addBars(1.5)).toThrowError(`bars should be an integer : 2.5`)
  });

  it('should add beats', () => {
    expect(new Position(0).addBeats(0, 4)).toEqual(new Position(0))
    expect(new Position(0).addBeats(1, 4)).toEqual(new Position(0, 1))
    expect(new Position(0, 2).addBeats(1, 4)).toEqual(new Position(0, 3))
    expect(new Position(0, 3).addBeats(1, 4)).toEqual(new Position(1))
    expect(new Position(0, 2).addBeats(1, 2)).toEqual(new Position(1, 1))
    expect(() => new Position(1).addBeats(-1, 4)).toThrowError(`beats should be positive : -1`)
    expect(() => new Position(1).addBeats(1.5, 4)).toThrowError(`beats should be an integer : 1.5`)
  });

  it('isBefore()', () => {
    expect(new Position(0).isBefore(new Position(1))).toBeTrue();
    expect(new Position(0).isBefore(new Position(0))).toBeFalse();
    expect(new Position(1).isBefore(new Position(0))).toBeFalse();
    expect(new Position(0, 3, 3.9999).isBefore(new Position(1))).toBeTrue();
  });

  it('isBeforeOrEquals()', () => {
    expect(new Position(0).isBeforeOrEquals(new Position(1))).toBeTrue();
    expect(new Position(0).isBeforeOrEquals(new Position(0))).toBeTrue();
    expect(new Position(1).isBeforeOrEquals(new Position(0))).toBeFalse();
    expect(new Position(0, 3, 3.9999).isBeforeOrEquals(new Position(1))).toBeTrue();
  });

  class Element implements PositionedElement {
    constructor(
      readonly startPosition: Position,
      readonly endPosition: Position,
    ) {
    }

    toString(): string {
      return `Element at ${PositionFormatter.DEBUG.format(this.startPosition)}`;
    }
  }

  const elements = [
    new Element(new Position(0), new Position(1)),
    new Element(new Position(1), new Position(2)),
  ];

  it('get element at (without overflow)', () => {
    expect(Position.getElementAt(new Position(-1), elements, false)).toBeUndefined();
    expect(Position.getElementAt(new Position(0), elements, false)).toBe(elements[0]);
    expect(Position.getElementAt(new Position(1), elements, false)).toBe(elements[1]);
    expect(Position.getElementAt(new Position(2), elements, false)).toBeUndefined();
  });

  it('get element at (with overflow)', () => {
    expect(Position.getElementAtWithOverflow(new Position(-1), elements)).toBe(elements[0]);
    expect(Position.getElementAtWithOverflow(new Position(0), elements)).toBe(elements[0]);
    expect(Position.getElementAtWithOverflow(new Position(1), elements)).toBe(elements[1]);
    expect(Position.getElementAtWithOverflow(new Position(2), elements)).toBe(elements[1]);
  });

  it('get relative position', () => {
    expect(new Position(0).relativeTo(new Position(0))).toEqual(new Position(0))
    expect(new Position(1).relativeTo(new Position(0))).toEqual(new Position(1))
    expect(new Position(1).relativeTo(new Position(1))).toEqual(new Position(0))
    expect(new Position(1, 1, 1.1).relativeTo(new Position(0))).toEqual(new Position(1, 1, 1.1))
    expect(() => new Position(1, 1).relativeTo(new Position(0, 1))).toThrowError(`Not implemented for position with more than bars only`)
    expect(new Position(0).relativeTo(new Position(1))).toEqual(new Position(-1))
  });

  it('modBars()', () => {
    expect(new Position(0).modBars(1)).toEqual(new Position(0))
    expect(new Position(1).modBars(1)).toEqual(new Position(0))
    expect(new Position(1).modBars(2)).toEqual(new Position(1))
    expect(new Position(2).modBars(2)).toEqual(new Position(0))
    expect(new Position(2, 1, 1.1).modBars(2)).toEqual(new Position(0, 1, 1.1))
    expect(() => new Position(2).modBars(2.5)).toThrowError(`bars should be an integer : 2.5`)
    expect(() => new Position(2).modBars(0)).toThrowError(`bars should be strictly positive : 0`)
    expect(() => new Position(2).modBars(-1)).toThrowError(`bars should be strictly positive : -1`)
  });

});

describe('PositionFormatter', () => {

  const pos0 = new Position(0, 0, 0);
  const pos01 = new Position(0, 1, 0);
  const pos011 = new Position(0, 1, 1);
  const pos0111 = new Position(0, 1, 1.1);
  const pos0115 = new Position(0, 1, 1.5);
  const pos0119 = new Position(0, 1, 1.9);
  const pos012 = new Position(0, 1, 2);

  describe('ABLETON_GLOBAL_TIMECODE', () => {
    const formatter = PositionFormatter.ABLETON_GLOBAL_TIMECODE;

    it('format()', () => {
      expect(formatter.format(pos0)).toEqual('1.1.1')
      expect(formatter.format(pos01)).toEqual('1.2.1')
      expect(formatter.format(pos011)).toEqual('1.2.2')
      expect(formatter.format(pos0111)).toEqual('1.2.2')
      expect(formatter.format(pos0115)).toEqual('1.2.2')
      expect(formatter.format(pos0119)).toEqual('1.2.2')
      expect(formatter.format(pos012)).toEqual('1.2.3')
    });

    it('parse()', () => {
      expect(formatter.parse('1.1.1')).toEqual(pos0)
      expect(formatter.parse('1.2.1')).toEqual(pos01)
      expect(formatter.parse('1.2.2')).toEqual(pos011)
      expect(formatter.parse('1.2.3')).toEqual(pos012)
    });

  });

  describe('DEBUG', () => {
    const formatter = PositionFormatter.DEBUG;

    it('format()', () => {
      expect(formatter.format(pos0)).toEqual('0:0:0')
      expect(formatter.format(pos01)).toEqual('0:1:0')
      expect(formatter.format(pos011)).toEqual('0:1:1')
      expect(formatter.format(pos0111)).toEqual('0:1:1.1')
      expect(formatter.format(pos0115)).toEqual('0:1:1.5')
      expect(formatter.format(pos0119)).toEqual('0:1:1.9')
      expect(formatter.format(pos012)).toEqual('0:1:2')
    });

    it('format()', () => {
      expect(formatter.parse('0:0:0')).toEqual(pos0)
      expect(formatter.parse('0:1:0')).toEqual(pos01)
      expect(formatter.parse('0:1:1')).toEqual(pos011)
      expect(formatter.parse('0:1:1.1')).toEqual(pos0111)
      expect(formatter.parse('0:1:1.5')).toEqual(pos0115)
      expect(formatter.parse('0:1:1.9')).toEqual(pos0119)
      expect(formatter.parse('0:1:2')).toEqual(pos012)
    });

  });

});
