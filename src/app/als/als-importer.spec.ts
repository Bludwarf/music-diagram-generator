import {AlsImporter} from "./als-importer";
import {getKarmaFile} from "../test/test-utils";

describe('AlsImporter', () => {

  // it('should load Petit papillon.als', (done) => {
  //   const alsImporter = new AlsImporter();
  //
  //
  //   // Source : https://stackoverflow.com/a/57331494/1655155
  //   const filePath = 'src/assets/als/Petit papillon.als';
  //   const request: XMLHttpRequest = createRequest(filePath );
  //
  //   request.onload = async r => {
  //     let blob = new Blob([request.response]);
  //     const url = URL.createObjectURL(blob);
  //     await alsImporter.load(blob)
  //     // expect(data).toBe('expected data');
  //     done();
  //   };
  //
  //   // trigger
  //   request.send(null);
  // });

  it('should load Petit papillon.als.xml', async (done) => {
    const alsImporter = new AlsImporter();
    const filePath = 'src/assets/als/Petit papillon.als.xml';
    const blob = await getKarmaFile(filePath)
    const alsProject = await alsImporter.loadUnzipped(blob)
    expect(alsProject).toBeTruthy();
    done();
  });

});
