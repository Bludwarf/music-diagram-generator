import {getKarmaFile} from "../test/test-utils";
import {ArchiveFile, unzipArchive} from "./file-utils";


describe('file-utils', () => {

    it(`unzipArchive`, async () => {
        const filePath = `src/test/assets/zip/file-utils.zip`;
        const blob = await getKarmaFile(filePath);
        const archive = await unzipArchive(blob);
        console.log(Object.keys(archive))

        const filesByFileName: Record<string, ArchiveFile> = {};
        const fileNames: string[] = [];
        for (const [fileName, archiveFile] of archive) {
            fileNames.push(fileName);
            filesByFileName[fileName] = archiveFile;
        }

        const fichier = "Fichier accentué.txt";
        const sousFichier = "Dossier accentué là/Sous fichier accentué.txt";
        expect(fileNames).toEqual([
            fichier,
            sousFichier,
        ]);
        expect(await filesByFileName[fichier].text()).toEqual("Contenu accentué");
        expect(await filesByFileName[sousFichier].text()).toEqual("Sous contenu accentué");
    });

});
