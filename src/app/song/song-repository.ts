import {Injectable} from "@angular/core";
import {EMPTY, SongEntry} from "./song-entry";
import {error} from "../utils";
import {SongInArchive} from "./song-archive";

@Injectable({
    providedIn: 'root'
})
export class SongRepository {
    private readonly songEntries: SongEntry[] = []

    pushAll(...songEntries: SongEntry[]) {
        for (const songEntry of songEntries) {
            this.removeSong(songEntry.name);
            this.songEntries.push(songEntry)
        }
    }

    async findSongEntry(songName: string, defaultSongEntryProvider?: () => Promise<SongEntry | undefined>): Promise<SongEntry | undefined> {
        defaultSongEntryProvider ??= () => Promise.resolve({
            ...EMPTY,
            name: songName,
        })
        const resolvedSongName = SongInArchive.resolveSongNameFromSetlist(songName);

        const existingSongEntry = this.songEntries.find(entry => this.songNameEquals(resolvedSongName, entry.name));
        if (existingSongEntry) return existingSongEntry;

        const createdSongEntry = await defaultSongEntryProvider?.();
        if (createdSongEntry) {
            this.songEntries.push(createdSongEntry);
        }

        return createdSongEntry;
    }

    async requireSongEntry(songName: string): Promise<SongEntry> {
        const entry = await this.findSongEntry(songName);
        if (!entry) error('SongEntry inconnu pour ' + songName);
        return entry;
    }

    private songNameEquals(expectedSongName: string | undefined, songName: string) {
        if (!expectedSongName) {
            return false
        }
        const format = (string: string) => string.toLowerCase().trim()
        return format(songName) === format(expectedSongName);
    }

    private removeSong(songName: string): void {
        this.removeSongEntry(songName);
    }

    private removeSongEntry(songName: string) {
        const index = this.songEntries.findIndex(entry => this.songNameEquals(songName, entry.name));
        if (index === -1) return;
        this.songEntries.splice(index, 1);
    }
}
