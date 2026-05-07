import Color from 'color';
import {PatternInStructure} from './structure/pattern/pattern-in-structure';
import abletonLive10ColorsColorPicker from "../assets/ableton-live-10-colors-color-picker.json"; // Source : Ableton Live 10 avec un Color Picker
import abletonLive10ColorsGitHub from "../assets/ableton-live-10-colors-github.json"; // Source : https://github.com/danhemerlein/ableton-colors/blob/main/colors.json
import {Structure} from './structure/structure';

const LIGHTEN_RATIO = 0.5;

export class BaseColor {
  readonly colorType: Color

  constructor(colorParam: ColorParam) {
    this.colorType = Color(colorParam)
  }

  darker(): BaseColor {
    return new BaseColor(this.colorType.darken(LIGHTEN_RATIO));
  }

  lighter(): BaseColor {
    return new BaseColor(this.colorType.lighten(LIGHTEN_RATIO));
  }

  toString(): string {
    return this.colorType.toString()
  }
}

type ColorParam = Color | string | ArrayLike<number> | number | { [key: string]: any };

// TODO encapsuler dans une class ColorPalette pour chaque @media
export const BLACK = new BaseColor('#000000')
export const BLUE = new BaseColor('#1976d2')
export const GREEN = new BaseColor('#3c6400')
export const GREEN_CS = new BaseColor('#1c6400')
export const GREEN_CF = new BaseColor('#486400')
export const ORANGE = new BaseColor('chocolate')
export const ORANGE_R_P = new BaseColor('#d5854a')
export const RED = new BaseColor('#d21e1e')
export const VIOLET = new BaseColor('#8a1ed2')

export class ColorResolver {

  private readonly patternColorByInitial: Record<string, BaseColor> = {}

  constructor(
    readonly structure: Structure,
  ) {
  }

  getPatternColor(patternInStructure: PatternInStructure): BaseColor {
    let color = patternInStructure.pattern.color
    if (color) {
      return color
    }

    const initial = patternInStructure.initial
    color = this.patternColorByInitial[initial]
    if (color) {
      return color
    }

    color = this.resolvePatternColor(patternInStructure)
    this.patternColorByInitial[initial] = color
    return color
  }

  resolvePatternColor(patternInStructure: PatternInStructure): BaseColor {
    if (patternInStructure.pattern.color) {
      return patternInStructure.pattern.color
    }
    switch (patternInStructure.pattern.name) {
      case 'AA':
        return GREEN;
      case 'BB':
        return ORANGE;
    }
    const initial = patternInStructure.initial
    if (initial) {
      switch (initial.charAt(0)) {
        case 'I':
        case 'B':
        case 'F':
        case 'P':
          return BLUE;
      }
      if (initial.startsWith('C')) {
        // const patternsInStructureWithSamePrefix = patternInStructure.structure.patternsInStructure.filter(p => p.initial.startsWith('C'))
        // console.log(patternsInStructureWithSamePrefix.map(p => p.pattern.name))
        if (initial.startsWith('Cs')) {
          return GREEN_CS
        }
        if (initial.startsWith('Cf')) {
          return GREEN_CF
        }
        if (initial.startsWith('C\'')) {
          return GREEN_CS.lighter();
        }
        return GREEN
      }
      if (initial.startsWith('R')) {
        if (initial.startsWith('R\'')) {
          return ORANGE_R_P
        }
        return ORANGE
      }
    }
    return RED
  }
}

/**
 * Convertisseur des couleurs de https://github.com/danhemerlein/ableton-colors/blob/main/colors.json
 */
// TODO la source ne correspond pas à ce qu'on peut capturer sur l'écran DELL (ex : 127EBE au lieu de 007DC0) (même valeur avec ou sans "Éclairage nocturne")
class AbletonLive10ColorFromGitHubMapper {
  private static readonly SOURCE = abletonLive10ColorsGitHub;

  orderByAbletonIndex<T extends { col: number, row: number }>(colors: T[]): T[] {
    const orderedColors = [...colors];
    orderedColors.sort((color1, color2) => this.getColorIndex(color1) - this.getColorIndex(color2));
    return orderedColors;
  }

  private getColorIndex<T extends { col: number, row: number }>(color: T): number {
    return (color.row - 1) * 14 + color.row - 1
  }
}

export class AbletonLive10Color extends BaseColor {
  private static readonly HEX_CODES_BY_INDEX = abletonLive10ColorsColorPicker;

  static fromIndex(index: number): AbletonLive10Color {
    if (index < 0 || index >= this.HEX_CODES_BY_INDEX.length) {
      throw new Error(`Index de couleur Ableton Live 10 invalide : ${index}`)
    }
    const hexCode = this.HEX_CODES_BY_INDEX[index];
    return new AbletonLive10Color(hexCode);
  }
}
