export interface IRythmBarEvent {
  bar: number;
  beat: number;
  division: number;
  note: string;
}

export class RythmBarEvent implements IRythmBarEvent {
  constructor(
    readonly bar = 1,
    readonly beat = 1,
    readonly division = 1,
    readonly note = ''
  ) {}

  static from(event: IRythmBarEvent): RythmBarEvent {
    return Object.assign(new RythmBarEvent(), event);
  }

  static fromEach(events: IRythmBarEvent[]): RythmBarEvent[] {
    return events.map(event => this.from(event));
  }

  get timeCode(): string {
    return abletonLiveTimeCode(this.bar, this.beat, this.division)
  }
}

export function abletonLiveTimeCode(barNumber = 1, beatNumber = 1, beatDivisionNumber = 1): string {
  let timeCode = beatDivisionNumber > 1 ? `.${beatDivisionNumber}` : '';
  if (timeCode || beatNumber > 1) {
    timeCode = `.${beatNumber}${timeCode}`
  }
  return `${barNumber}${timeCode}`
}