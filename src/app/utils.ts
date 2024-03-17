export function sequence(size: number, offset = 0): number[] {
  return Array.from(new Array(size).keys()).map(val => val + offset)
}

/**
 * Pour la version mobile, on affiche une alerte, car on n'a pas forcément accès à la console pour voir les erreurs
 */
export function error(message: string): never {
  alert(message)
  throw new Error(message)
}
