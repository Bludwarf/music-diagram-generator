import {AlsExtractor} from "./als-extractor";
import {importAlsProject} from "./als-importer.spec";

describe('AlsExtractor', () => {

    const createExtractorFor = async (projectName: string): Promise<AlsExtractor> => {
        const alsProject = await importAlsProject(projectName);
        return new AlsExtractor(alsProject)
    }

    it('should get sample duration from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')
        expect(extractor.sampleDurationInSeconds).toBe(208)
    });

    describe('Man In The Mirror', () => {
        // <WarpMarker Id="4" SecTime="0.288208616780045279" BeatTime="0" />
        // <WarpMarker Id="9" SecTime="319.76723356009069" BeatTime="534.23802941849817" />
        // Dernier WarpMarker ajouté manuellement dans Live, sur la fin de la forme d'onde (dernière position cliquable)

        it('should get sample SecTime duration from Man In The Mirror', async () => {
            const extractor = await createExtractorFor('Man In The Mirror')
            expect(extractor.sampleDurationInSeconds).toBe(319.76723356009069)
        });

    })

    it('should get Wrap Markers from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')

        const warpMarkers = extractor.warpMarkers;
        expect(warpMarkers.length).toBe(74)

        const firstWarpMarker = warpMarkers[0]
        expect(firstWarpMarker.secTime).toBe(0)
        expect(firstWarpMarker.beatTime).toBe(-1.1762159715284715)

        const lastWarpMarker = warpMarkers[warpMarkers.length - 1]
        expect(lastWarpMarker.secTime).toBe(197.84312565104167)
        expect(lastWarpMarker.beatTime).toBe(360.35486076423575)
    });

    it('should get JSON structure from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')
        const jsonStructure = extractor.extractStructureObject()
        console.log(JSON.stringify(jsonStructure))
        expect(jsonStructure).toBeTruthy()
    });

    it('should get recording name from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')
        const recordingDto = extractor.extractRecordingDto()
        expect(recordingDto.name).toEqual('DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01')
    });

    it('should get recording sampleDuration from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')
        const recordingDto = extractor.extractRecordingDto()
        expect(recordingDto.sampleDurationInSeconds).toEqual(208)
    });

});
