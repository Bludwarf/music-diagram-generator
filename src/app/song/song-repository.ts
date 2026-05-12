import {Injectable} from "@angular/core";
import {EMPTY, SongEntry} from "./song-entry";
import {error} from "../utils";

@Injectable({
    providedIn: 'root'
})
export class SongRepository {
    private readonly _songNames: string[] = []
    private readonly songEntries: SongEntry[] = []

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
        switch (songName.toLocaleLowerCase()) {
            case 'le phare':
                // TODO Les alias de nom de morceau ne sont pas encore gérés depuis #52
                return this.findSongEntry('Le jour (le phare)', defaultSongEntry);
        }
        return this.songEntries.find(entry => this.songNameEquals(songName, entry.name)) || defaultSongEntry;
    }

    requireSongEntry(songName: string) {
        const entry = this.findSongEntry(songName);
        if (!entry) {
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
        const index = this._songNames.indexOf(songName);
        if (index === -1) return;
        this._songNames.splice(index, 1);
    }

    private removeSongEntry(songName: string) {
        const index = this.songEntries.findIndex(entry => this.songNameEquals(songName, entry.name));
        if (index === -1) return;
        this.songEntries.splice(index, 1);
    }
}
