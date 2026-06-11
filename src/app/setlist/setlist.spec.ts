import {getSongArchive} from "../song/song-archive.spec";
import {Setlist} from "./setlist";
import {SongRepository} from "../song/song-repository";
import {Structure} from "../structure/structure";
import createSpyObj = jasmine.createSpyObj;

describe('Setlist', () => {

    const encodedArchiveName = "Groupe de test (15%2F05%2F2026).zip";

    it(`fromSongArchive`, async () => {
        const songArchive = await getSongArchive(encodedArchiveName);

        const songRepository = createSpyObj<SongRepository>('SongRepository', [
            'findSongEntry',
        ]);

        songRepository.findSongEntry.and.callFake((songName: string) => {
            return Promise.resolve({
                name: songName,
                structure: new Structure([]),
            })
        })

        const setlist = await Setlist.fromSongArchive(songArchive, songRepository);

        expect(setlist.title).toEqual("Groupe de test");
        expect(setlist.version).toEqual("15/05/2026");
        expect(setlist.songs.map(song => song.songEntry.name)).toEqual([
            'Morceau sans version',
            'Morceau avec version textuelle',
            'Morceau avec version datée',
            `Morceau absent de l'archive`,
            'Morceau sans version', // rappel
        ]);
    });

});
