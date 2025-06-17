import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import leJourEntry from "../../song/entries/Le jour (le phare)";
import {SongRepository} from "../../song/song-repository";
import {Structure} from "../../structure/structure";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-structure-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './structure-list.component.html',
  styleUrl: './structure-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureListComponent implements OnInit {

  protected structure: Structure;

  constructor(
    private readonly songRepository: SongRepository,
  ) {
    const songEntry = this.songRepository.requireSongEntry('Le jour (le phare)');
    this.structure = songEntry.structure;
  }

  ngOnInit(): void {
  }

}
