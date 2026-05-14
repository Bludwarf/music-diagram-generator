import {getKarmaFile} from "../test/test-utils";
import {importAlsProject} from "../als/als-importer.spec";
import {SongArchive} from "./song-archive";
import {describe, test} from "vitest";

export async function getSongArchive(archiveName: string): Promise<SongArchive> {
    const filePath = `http://localhost:51223/src/test/assets/zip/${archiveName}`;
    const response = await fetch(filePath);
    console.log(response)
    const blob = await getKarmaFile(filePath);
    return SongArchive.fromZip(blob);
}

describe('SongArchive', () => {

    test('should load song without accent and without version', async () => {
        const songArchive = await getSongArchive("song-archive-without-setlist.zip");
        expect(songArchive).toBeTruthy();
    });

});
