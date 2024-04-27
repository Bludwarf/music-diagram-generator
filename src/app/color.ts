import Color from 'color';
import { PatternInStructure } from './structure/pattern/pattern-in-structure';
import { Structure } from './structure/structure';

export class BaseColor {
    private readonly colorType: Color

    constructor(colorParam: ColorParam) {
        this.colorType = Color(colorParam)
    }

    toString(): string {
        return this.colorType.toString()
    }
}

type ColorParam = Color | string | ArrayLike<number> | number | { [key: string]: any };

export const BLUE = new BaseColor('#1976d2')
export const GREEN = new BaseColor('#3c6400')
export const GREEN_CS = new BaseColor('#1c6400')
export const GREEN_CF = new BaseColor('#486400')
export const ORANGE = new BaseColor('chocolate')
export const ORANGE_R_P = new BaseColor('#d5854a')
export const RED = new BaseColor('#d21e1e')

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
        const initial = patternInStructure.initial
        if (initial) {
            if (initial.startsWith('I') || initial.startsWith('B') || initial.startsWith('F')) {
                return BLUE
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
