import { stripExtension } from "./utils";

describe('stripExtension', () => {

    it('should do nothing when no extension', () => {
        expect(stripExtension('fichier')).toBe('fichier')
    });

    it('should strip single extension', () => {
        expect(stripExtension('fichier.wav')).toBe('fichier')
    });

    it('should strip multiple extension', () => {
        expect(stripExtension('fichier.jpeg.bak')).toBe('fichier')
    });

    it('should not strip extension-like', () => {
        expect(stripExtension('fichier.parfait.wav')).toBe('fichier.parfait')
    });

});
