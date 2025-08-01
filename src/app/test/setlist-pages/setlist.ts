import {StructureInGrid} from "../structure-grid/StructureInGrid";
import {SongRepository} from "../../song/song-repository";
import {SongEntry} from "../../song/song-entry";

export class Setlist {
  readonly songs!: SongInSetlist[];

  constructor(
    readonly title: string,
    songs: SongInSetlist[],
    readonly version: string,
  ) {
    this.songs = songs;
  }

  static from(version: string, songRepository: SongRepository, songNames: string[]) {
    const songs = songNames.map(songName => {
      const songEntry = songRepository.findSongEntryOrEmpty(songName);
      return SongInSetlist.from(songEntry);
    });
    return new Setlist('Setlist Didaf\'ta', songs, version);
  }

  static getSetlistFicheTechnique(songRepository: SongRepository) {
    return Setlist.from('Fiche technique au 19/04/2025', songRepository, [
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

  static getSetlist2024YouennSimon(songRepository: SongRepository) {
    return Setlist.from('Imprimée du concert 2024 avec Youenn et Simon', songRepository, [
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

  static getSetlist19_04_2025(songRepository: SongRepository) {
    return Setlist.from('Après répète du 19/04/2025', songRepository, [
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

  static getSetlist30_05_2025(songRepository: SongRepository) {
    return Setlist.from('Après répète du 30/05/2025', songRepository, [
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

  static getSetlist20_06_2025(songRepository: SongRepository) {
    return Setlist.from('20/06/2025 (Saint Martin de Landelle)', songRepository, [
      'Intro',
      'La femme dragon',
      'Petit papillon',
      'Solitude',
      'La 4L',
      'Le résistant',
      'Nuages blancs',
      'Kas a-barh',
      // (Medley cornemuse)
      //   Roak an roll
      //   Scotland the Brave
      //   When The Saints Go Marching In
      'Elle rêve à quoi',
      'Noyer le silence',
      'Le phare',
      'Aucun respect',
      'Au son des bars',
      'Surcouf',
      // Rappel(s) non enregistré(s)
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
