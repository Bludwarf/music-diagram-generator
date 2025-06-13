import {Injectable} from "@angular/core";
import {EMPTY, SongEntry} from "./song-entry";
import {error} from "../utils";
import aucunRespect from "../song/entries/Aucun respect";
import auSonDesBars from "../song/entries/Au son des bars";
import elleReveEntry from "../song/entries/Elle reve a quoi";
import happy from "../song/entries/Happy";
import kasABarh from "../song/entries/Kas a-barh";
import la4LEntry from "../song/entries/La 4L";
import introEntry from "../song/entries/Intro";
import laFemmeDragonEntry from "../song/entries/La femme dragon";
import leJourEntry from "../song/entries/Le jour (le phare)";
import mirages from "../song/entries/Mirages";
import noyerEntry from "../song/entries/Souffrance";
import nuagesEntry from "../song/entries/Nuages blancs";
import petitPapillonEntry from "../song/entries/Petit Papillon";
import resEntry from "../song/entries/Le résistant";
import rockollection from "../song/entries/Rockollection";
import solEntry from "../song/entries/Solitude";
import surcoufEntry from "../song/entries/Surcouf";
import toutFoufou from "../song/entries/Tout foufou";

@Injectable({
  providedIn: 'root'
})
export class SongRepository {
  private songEntries: SongEntry[] = []

  constructor() {
    this.pushAll(
      aucunRespect,
      auSonDesBars,
      elleReveEntry,
      happy,
      la4LEntry,
      introEntry,
      kasABarh,
      laFemmeDragonEntry,
      leJourEntry,
      mirages,
      noyerEntry,
      nuagesEntry,
      petitPapillonEntry,
      resEntry,
      rockollection,
      solEntry,
      surcoufEntry,
      toutFoufou,
    )
  }

  private pushAll(...songEntries: SongEntry[]) {
    for (const songEntry of songEntries) {
      this.songEntries.push(songEntry)
    }
  }

  private findSongEntry(songName: string, defaultSongEntry?: SongEntry | undefined): SongEntry | undefined {
    switch (songName.toLocaleLowerCase()) {
      case 'le phare': return leJourEntry;
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
      ... EMPTY,
      name: songName,
    })!!;
  }

  private songNameEquals(expectedSongName: string | undefined, songName: string) {
    if (!expectedSongName) {
      return false
    }
    const format = (string: string) => string.toLowerCase().trim()
    return format(songName) === format(expectedSongName);
  }
}
