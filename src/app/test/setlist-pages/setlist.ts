import {StructureInGrid} from "../structure-grid/StructureInGrid";
import {SongRepository} from "../../song/song-repository";
import {SongEntry} from "../../song/song-entry";

export class Setlist {
  songs!: SongInSetlist[];

  constructor(songs: SongInSetlist[]) {
    this.songs = songs;
  }

  static from(songRepository: SongRepository, songNames: string[]) {
    const songs = songNames.map(songName => {
      const songEntry = songRepository.findSongEntryOrEmpty(songName);
      return SongInSetlist.from(songEntry);
    });
    return new Setlist(songs);
  }

  /**
   * Setlist de la fiche technique au 19/04/2025
   */
  static getSetlistFicheTechnique(songRepository: SongRepository) {
    return Setlist.from(songRepository, [
      'Intro',
      'Surcouf',
      'Nuages blancs',
      'Le résistant',
      'Solitude',
      'Petit papillon',
      'La femme dragon',
      'Mirage',
      'Le phare',
      'Noyer le silence',
      'Aux sons des bars',
      'Elle rêve à quoi',
      'Suite de kas a-barh', // TODO orthographe ?
      'Raok an roal',
      // 'Rappel : Solitude',
    ]);
  }

  /**
   * Setlist imprimée du concert 2024 avec Youenn et Simon
   */
  static getSetlist2024YouennSimon(songRepository: SongRepository) {
    return Setlist.from(songRepository, [
      'Intro',
      'La femme dragon',
      'Petit papillon',
      'Solitude',
      'Surcouf',
      'Andro (Kas ha Bar)', // TODO orthographe ?
      'Nuages blancs',
      'Le résistant',
      'Elle rêve à quoi',
      'Noyer le silence',
      'Le phare',
      'Plinn',
      'La cochinchine',
      'Aucun respect',
      // 'Rappel : Solitude',
    ]);
  }

  /**
   * Setlist après répète du 19/04/2025
   */
  static getSetlist19_04_2025(songRepository: SongRepository) {
    return Setlist.from(songRepository, [
      'Intro',
      'La femme dragon',
      'Petit papillon',
      'Solitude',
      'Surcouf',
      'Nuages blancs',
      'Le résistant',
      'Elle rêve à quoi',
      'Noyer le silence',
      'Le phare',
      'Aucun respect',
      'Au son des bars',
      'Mirages',
      'Kas a-barh',
      'La 4L',
      // 'Rappel : Solitude',
    ]);
  }

  /**
   * Setlist après répète du 30/05/2025
   */
  static getSetlist30_05_2025(songRepository: SongRepository) {
    return Setlist.from(songRepository, [
      'Intro',
      'Noyer le silence',
      'Petit papillon',
      'Solitude',
      'La 4L',
      'Nuages blancs',
      'Le résistant',
      'Elle rêve à quoi',
      'La femme dragon',
      'Le phare',
      'Aucun respect',
      'Au son des bars',
      'Kas a-barh',
      'Surcouf',
      // 'Rappel : Solitude',
    ]);
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
}
