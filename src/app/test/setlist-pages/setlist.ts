import {StructureInGrid} from "../structure-grid/StructureInGrid";
import {SongRepository} from "../../song/song-repository";
import {SongEntry} from "../../song/song-entry";
import {SongArchive} from "../../song/song-archive";
import {error} from "../../utils";

export class Setlist implements Iterable<SongInSetlist> {
    readonly songs!: SongInSetlist[];

    constructor(
        readonly title: string,
        songs: SongInSetlist[],
        readonly version: string,
    ) {
        this.songs = songs;
    }

    [Symbol.iterator](): Iterator<SongInSetlist> {
        return this.songs[Symbol.iterator]();
    }

    static fromSongArchive(songArchive: SongArchive, songRepository: SongRepository): Setlist {
        const titleVersionRegex = /^([^(]+) +\((.+)\)$/;
        const matches = titleVersionRegex.exec(songArchive.title);
        if (!matches) error(`Impossible de créer une setlist à partir du nom de l'archive ${songArchive.title} car on ne retrouve pas la version (regex : ${titleVersionRegex.exec(songArchive.title)})`)
        const bandName = matches[1];
        const setlistVersion = matches[2];
        return Setlist.from(`Setlist ${bandName}`, setlistVersion, songRepository, songArchive.setlist)
    }

    private static from(title: string, version: string, songRepository: SongRepository, songNames: readonly string[]) {
        const songs = songNames.map(songName => {
            const songEntry = songRepository.findSongEntryOrEmpty(songName);
            return SongInSetlist.from(songEntry);
        });
        return new Setlist(title, songs, version);
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
