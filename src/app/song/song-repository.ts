import {Injectable} from "@angular/core";
import {EMPTY, SongEntry} from "./song-entry";
import {error, remove} from "../utils";
import {SongInArchive} from "./song-archive";
import {SongArchiveLoader} from "./song-archive-loader.service";

@Injectable({
    providedIn: 'root'
})
export class SongRepository {
    private readonly _songNames: string[] = []
    private readonly songEntries: SongEntry[] = []


    constructor(
        private readonly songArchiveLoader: SongArchiveLoader,
    ) {
    }

    get songNames(): readonly string [] {
        return this._songNames;
    }

    pushAll(...songEntries: SongEntry[]) {
        for (const songEntry of songEntries) {
            this.removeSong(songEntry.name);
            this._songNames.push(songEntry.name)
            this.songEntries.push(songEntry)
        }
    }

    private findSongEntry(songName: string, defaultSongEntry?: SongEntry | undefined): SongEntry | undefined {
        const resolvedSongName = SongInArchive.resolveSongNameFromSetlist(songName);
        return this.songEntries.find(entry => this.songNameEquals(resolvedSongName, entry.name)) || defaultSongEntry;
    }

    async requireSongEntry(songName: string, fromSongArchiveLoader = false): Promise<SongEntry> {
        const entry = this.findSongEntry(songName);
        if (!entry) {
            if (!fromSongArchiveLoader && this.songArchiveLoader.isDefaultSong(songName)) {
                await this.songArchiveLoader.getDefaultSetlist(this);
                return this.requireSongEntry(songName, true);
            }
            error('SongEntry inconnu pour ' + songName)
        }
        return entry;
    }

    findSongEntryOrEmpty(songName: string): SongEntry {
        return this.findSongEntry(songName, {
            ...EMPTY,
            name: songName,
        })!;
    }

    private songNameEquals(expectedSongName: string | undefined, songName: string) {
        if (!expectedSongName) {
            return false
        }
        const format = (string: string) => string.toLowerCase().trim()
        return format(songName) === format(expectedSongName);
    }

    private removeSong(songName: string): void {
        this.removeSongName(songName);
        this.removeSongEntry(songName);
    }

    private removeSongName(songName: string) {
        remove(songName, this._songNames);
    }

    private removeSongEntry(songName: string) {
        const index = this.songEntries.findIndex(entry => this.songNameEquals(songName, entry.name));
        if (index === -1) return;
        this.songEntries.splice(index, 1);
    }
}
