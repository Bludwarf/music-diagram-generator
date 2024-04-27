import { Observable, fromEvent, tap, debounceTime } from "rxjs"

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

/**
 * Pour la version mobile, on affiche une alerte, car on n'a pas forcément accès à la console pour voir les avertissements
 */
export function warn(...data: any[]): void {
  alert(`Avertissement : ${JSON.stringify(data)}`)
  console.warn(...data)
}

export interface Builder<T> {
  build(): T
}

/**
 * @deprecated Pour l'instant pose des problèmes de boucle infinie de détection de changement (comme les setTimeout)
 */
export function fromWindowResize(): Observable<Event> {
  // TODO il suffit de souscrire pour déclencher une détection de changement ? : https://stackoverflow.com/questions/35527456/angular-window-resize-event
  return fromEvent(window, 'resize').pipe(
    tap(() => console.log('window resize')),
    debounceTime(1000),
    tap(() => console.log('debounced window resize'))
  )
}

export function stripExtension(fileName: string): string {
  const m = /^(.+?)(\.[a-z]{2,4})+$/.exec(fileName)
  if (m) {
    return m[1]
  } else {
    return fileName
  }
}
