export function sequence(size: number, offset = 0): number[] {
  return Array.from(new Array(size).keys()).map(val => val + offset)
}
