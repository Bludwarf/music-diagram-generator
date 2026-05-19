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

    it('should get recording sampleBeatTimeDuration from Petit papillon', async () => {
        const extractor = await createExtractorFor('Petit papillon')
        const recordingDto = extractor.extractRecordingDto()
        expect(recordingDto.sampleBeatTimeDuration).toEqual(378.36283820346318 - -1.1762159715284715)
    });

    it('should get recording sampleBeatTimeDuration from Nuages Blancs', async () => {
        const extractor = await createExtractorFor('Nuages blancs')
        const recordingDto = extractor.extractRecordingDto()
        expect(recordingDto.sampleBeatTimeDuration).toEqual(932 - -0.782730030386280418)
    });

    it('should get recording sampleBeatTimeDuration from La femme dragon', async () => {
        const extractor = await createExtractorFor('La femme dragon')
        const recordingDto = extractor.extractRecordingDto()
        expect(recordingDto.sampleBeatTimeDuration).toEqual(545.33568827006332 - -2.0646923389110889)
    });

});
