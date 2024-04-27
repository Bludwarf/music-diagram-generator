import { BLUE, BaseColor as Color, ColorResolver, GREEN, GREEN_CS, RED } from "./color";
import { Key } from "./notes";
import { Pattern, PatternInitData } from "./structure/pattern/pattern";
import { Structure } from "./structure/structure";

describe('ColorResolver', () => {

    const patternInitData: PatternInitData = {
        name: 'Pattern',
        key: Key.Gm,
        chords: '| Bb | F | C | Gm |',
    }

    it('should get defined pattern color', () => {
        const color = new Color('orange')
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Guitare seule',
                color,
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[0]
        expect(colorResolver.getPatternColor(pattern)).toBe(color);
    });

    it('should get default color', () => {
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Solo',
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[0]
        expect(colorResolver.getPatternColor(pattern)).toEqual(RED);
    });

    it('should get Intro color', () => {
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Intro',
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[0]
        expect(colorResolver.getPatternColor(pattern)).toEqual(BLUE);
    });

    it('should get Bombarde color', () => {
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Bombarde',
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[0]
        expect(colorResolver.getPatternColor(pattern)).toEqual(BLUE);
    });

    it('should get Final color', () => {
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Final',
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[0]
        expect(colorResolver.getPatternColor(pattern)).toEqual(BLUE);
    });

    it('should get different analoguous colors for analoguous patterns (Couplet)', () => {
        const structure = Structure.builder()
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Couplet',
            }))
            .add(Pattern.fromData({
                ...patternInitData,
                name: 'Couplet sautillant',
                initial: 'Cs',
            }))
            .build()
        const colorResolver = new ColorResolver(structure)
        const pattern = structure.patternsInStructure[1]
        expect(colorResolver.getPatternColor(pattern)).toEqual(GREEN_CS);
    });

});
