import { Injectable } from "@angular/core";
import { SongEntry } from "./song-entry";
import petitPapillonEntry from "../song/entries/Petit Papillon";
import laFemmeDragonEntry from "../song/entries/La femme dragon";
import surcoufEntry from "../song/entries/Surcouf";
import leJourEntry from "../song/entries/Le jour (le phare)";
import resEntry from "../song/entries/Le résistant";
import noyerEntry from "../song/entries/Souffrance";
import nuagesEntry from "../song/entries/Nuages blancs";
import la4LEntry from "../song/entries/La 4L";
import solEntry from "../song/entries/Solitude";
import elleReveEntry from "../song/entries/Elle reve a quoi";
import toutFoufou from "../song/entries/Tout foufou";
import { error } from "../utils";

@Injectable({
    providedIn: 'root'
})
export class SongRepository {
    private songEntries: SongEntry[] = []

    constructor() {
        this.pushAll(
            petitPapillonEntry,
            laFemmeDragonEntry,
            surcoufEntry,
            leJourEntry,
            resEntry,
            noyerEntry,
            nuagesEntry,
            la4LEntry,
            solEntry,
            elleReveEntry,
            toutFoufou,
        )
    }

    private pushAll(...songEntries: SongEntry[]) {
        for (const songEntry of songEntries) {
            this.songEntries.push(songEntry)
        }
    }

    requireSongEntry(songName: string | undefined) {
        const entry = this.songEntries.find(entry => this.songNameEquals(songName, entry.name));
        if (!entry) {
            error('SongEntry inconnu pour ' + songName)
        }
        return entry;
    }

    private songNameEquals(expectedSongName: string | undefined, songName: string) {
        if (!expectedSongName) {
            return false
        }
        const format = (string: string) => string.toLowerCase().trim()
        return format(songName) === format(expectedSongName);
    }
}
