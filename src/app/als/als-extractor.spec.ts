import {AlsImporter} from "./als-importer";
import {getKarmaFile} from "../test/test-utils";
import {AlsExtractor} from "./als-extractor";
import {Time} from "../time";

describe('AlsExtractor', () => {

  const createExtractorFor = async (filePath: string): Promise<AlsExtractor> => {
    const alsImporter = new AlsImporter();
    const blob = await getKarmaFile(filePath)
    const alsProject = await alsImporter.loadUnzipped(blob)
    return new AlsExtractor(alsProject)
  }

  it('should get sample duration from Petit papillon', async () => {
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)
    expect(extractor.sampleDuration.toSeconds()).toBe(Time.fromValue(208).toSeconds())
  });

  it('should get Wrap Markers from Petit papillon', async () => {
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)

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
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)
    const jsonStructure = extractor.extractStructureObject()
    console.log(JSON.stringify(jsonStructure))
    expect(jsonStructure).toBeTruthy()
  });

  it('should get recording name from Petit papillon', async () => {
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)
    const recordingInitData = extractor.extractRecordingInitData()
    expect(recordingInitData.name).toEqual('DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01')
  });

  it('should get recording sampleDuration from Petit papillon', async () => {
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)
    const recordingInitData = extractor.extractRecordingInitData()
    expect(recordingInitData.sampleDuration).toEqual(208)
  });

  it('should get recording sampleBeatTimeDuration from Petit papillon', async () => {
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const extractor = await createExtractorFor(filePath)
    const recordingInitData = extractor.extractRecordingInitData()
    expect(recordingInitData.sampleBeatTimeDuration).toEqual(378.36283820346318 - -1.1762159715284715)
  });

  it('should get recording sampleBeatTimeDuration from Nuages Blancs', async () => {
    const filePath = 'src/assets/als/Nuages blancs.als.xml';
    const extractor = await createExtractorFor(filePath)
    const recordingInitData = extractor.extractRecordingInitData()
    expect(recordingInitData.sampleBeatTimeDuration).toEqual(932 - -0.782730030386280418)
  });

  it('should get recording sampleBeatTimeDuration from La femme dragon', async () => {
    const filePath = 'src/assets/als/La femme dragon.als.xml';
    const extractor = await createExtractorFor(filePath)
    const recordingInitData = extractor.extractRecordingInitData()
    expect(recordingInitData.sampleBeatTimeDuration).toEqual(545.33568827006332 - -2.0646923389110889)
  });

});
