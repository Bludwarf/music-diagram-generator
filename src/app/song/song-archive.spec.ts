import {getKarmaFile} from "../test/test-utils";
import {SongArchive} from "./song-archive";

export async function getSongArchive(archiveName: string): Promise<SongArchive> {
    const encodedArchiveName = encodeURIComponent(archiveName);
    const basePath = "src/test/assets/zip/";
    const file = await getKarmaFile(basePath + encodedArchiveName, basePath + archiveName);
    return SongArchive.fromZip(file);
}

type GetRecordingOfParams = [string, string, string | undefined];

describe('SongArchive', () => {

    describe('SongArchive sans setlist', () => {

        const archiveName = "song-archive-sans-setlist.zip";

        const allRecordingOfParams = [
            [`Morceau sans version`, `Enregistrement sans version`, undefined],
            [`Morceau avec version textuelle`, `Enregistrement avec version textuelle`, `Album`],
            [`Morceau avec version datée`, `Enregistrement avec version datée`, `30/05/2025`],
            [`Morceau avec /`, `Enregistrement sans version`, undefined],
            [`morceau sans version`, `Enregistrement sans version`, undefined],
            [`MORCEAU SANS VERSION`, `Enregistrement sans version`, undefined],
        ] as GetRecordingOfParams[];

        allRecordingOfParams.forEach(([songName, recordingName, version]) => {

            describe(songName, () => {

                it(`version`, async () => {
                    const songArchive = await getSongArchive(archiveName);
                    expect(songArchive.song(songName).version).toEqual(version);
                });

                it(`recording`, async () => {
                    const songArchive = await getSongArchive(archiveName);
                    const recording = await songArchive.song(songName).recording;
                    expect(recording?.name).toEqual(recordingName);
                });

                it(`structure`, async () => {
                    const songArchive = await getSongArchive(archiveName);
                    const structure = await songArchive.song(songName).structure;
                    expect(structure).toBeTruthy();
                    expect(typeof structure).toBe("object");
                });

            });

        });

    });

    describe('SongArchive avec setlist', () => {

        const archiveName = "Groupe de test (15%2F05%2F2026).zip";

        it(`title & setlist`, async () => {
            const songArchive = await getSongArchive(archiveName);
            expect(songArchive.title).toEqual("Groupe de test (15/05/2026)");
            expect(songArchive.setlist).toEqual([
                'Morceau sans version',
                'Morceau avec version textuelle',
                'Morceau avec version datée',
                `Morceau absent de l'archive`,
                'Morceau sans version', // rappel
            ]);
        });

        it(`iterate over songs in setlist order`, async () => {
            const songArchive = await getSongArchive(archiveName);
            const songNames: string[] = [];
            for (const song of songArchive) {
                songNames.push(song.name);
            }
            expect(songNames).toEqual([
                'Morceau sans version',
                'Morceau avec version textuelle',
                'Morceau avec version datée',
            ]);
        });

    });

});
