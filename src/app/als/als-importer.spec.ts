import {AlsImporter} from "./als-importer";
import {getKarmaFile} from "../test/test-utils";

export async function importAlsProject(projectName: string) {
    const filePath = `src/test/assets/als/${projectName}.als`;
    const alsImporter = new AlsImporter();
    const blob = await getKarmaFile(filePath)
    return await alsImporter.load(blob);
}

describe('AlsImporter', () => {

    it('should load Petit papillon', async () => {
        const alsProject = await importAlsProject('Petit papillon')
        expect(alsProject).toBeTruthy();
        expect(alsProject.audioTracks.length).toBe(5);
    });

});
