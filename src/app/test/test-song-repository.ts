import {SongEntry} from "../song/song-entry";
import {Injectable} from "@angular/core";
import {SongEntryMapper} from "../json/parsers/song-entry-mapper.service";
import {SongFileName, SongFileSystem, SongInFileSystem} from "../song/song-archive";
import {SongRepository} from "../song/song-repository";
import {fetchAssetFile} from "../utils/file-utils";

@Injectable()
export class TestSongRepository extends SongRepository {

    private readonly songDirectory = new SongDirectory("Tests", "test/songs")

    constructor(
        private readonly songEntryMapper: SongEntryMapper,
    ) {
        super();
    }

    async newSongEntry(songName: string): Promise<SongEntry> {
        console.log(`Chargement du morceau de test : ${songName}`);
        return this.songEntryMapper.modelFromSong(this.songDirectory.song(songName));
    }

    override async findSongEntry(songName: string, defaultSongEntryProvider?: () => Promise<SongEntry | undefined>): Promise<SongEntry | undefined> {
        defaultSongEntryProvider ??= () => this.newSongEntry(songName);
        return super.findSongEntry(songName, defaultSongEntryProvider);
    }

}

class SongDirectory extends SongFileSystem<SongInDirectory> {

    constructor(
        title: string,
        public readonly url: string,
    ) {
        super(`à l'URL ${url}`, title, {}, {}, []);
    }

    protected getSong(songName: string, _required: boolean): SongInDirectory | undefined {
        return new SongInDirectory(this, songName);
    }

}

class SongInDirectory extends SongInFileSystem {

    public readonly url: string;

    constructor(
        songDirectory: SongDirectory,
        name: string,
    ) {
        super(songDirectory, name, undefined);
        this.url = `${songDirectory.url}/${this.name}`;
    }

    protected async getFile(fileName: SongFileName, _extension?: string): Promise<Blob | undefined> {
        try {
            const response = await fetchAssetFile(`${this.url}/${fileName}`);
            if (!response.ok) return undefined;
            return await response.blob();
        } catch {
            return undefined;
        }
    }

}
