import {AlsImporter} from "./als-importer";
import {getKarmaFile} from "../test/test-utils";
import {StructureExtractorFromAls} from "./structure-extractor-from-als";
import {Time} from "../time";

describe('AlsExtractor', () => {

  const createExtractorFor = async (filePath: string): Promise<StructureExtractorFromAls> => {
    const alsImporter = new AlsImporter();
    const blob = await getKarmaFile(filePath)
    const alsProject = await alsImporter.loadUnzipped(blob)
    return new StructureExtractorFromAls(alsProject)
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
    const jsonStructure = extractor.toStructureObject()
    console.log(JSON.stringify(jsonStructure))
    expect(jsonStructure).toBeTruthy()
  });

});
