import {StructureInGrid} from "./pages/structure-grid/StructureInGrid";
import {SongRepository} from "../song/song-repository";
import {SongEntry} from "../song/song-entry";
import {SongArchive} from "../song/song-archive";

export class Setlist implements Iterable<SongInSetlist> {
    readonly songs!: SongInSetlist[];

    constructor(
        readonly title: string,
        songs: SongInSetlist[],
        readonly version?: string,
    ) {
        this.songs = songs;
    }

    [Symbol.iterator](): Iterator<SongInSetlist> {
        return this.songs[Symbol.iterator]();
    }

    static fromSongArchive(songArchive: SongArchive, songRepository: SongRepository): Promise<Setlist> {
        const titleVersionRegex = /^([^(]+) +\((.+)\)$/;
        const matches = titleVersionRegex.exec(songArchive.title);
        const bandName = matches?.[1];
        const setlistTitle = bandName ?? songArchive.title;
        const setlistVersion = matches?.[2];
        return Setlist.from(setlistTitle, setlistVersion, songRepository, songArchive.setlist)
    }

    static async from(title: string, version: string | undefined, songRepository: SongRepository, songNames: readonly string[]) {
        const songEntries: SongEntry[] = [];
        for (const songName of songNames) {
            const songEntry = await songRepository.findSongEntry(songName);
            if (songEntry) {
                songEntries.push(songEntry)
            }
        }
        return new Setlist(title, songEntries.map(songEntry => SongInSetlist.from(songEntry)), version);
    }

}

export class SongInSetlist {
    readonly songEntry!: SongEntry;
    readonly structureInGrid!: StructureInGrid;

    constructor(songEntry: SongEntry, structureInGrid: StructureInGrid) {
        this.songEntry = songEntry;
        this.structureInGrid = structureInGrid;
    }

    static from(songEntry: SongEntry) {
        const structureInGrid = new StructureInGrid(songEntry.structure);
        return new SongInSetlist(songEntry, structureInGrid);
    }

    get name(): string {
        return this.songEntry.name;
    }
}
