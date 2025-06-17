import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SongRepository} from "../../song/song-repository";
import {StructurePageComponent} from "../structure-page/structure-page.component";
import {Setlist} from './setlist';
import {Title} from "@angular/platform-browser";
import {SetlistTocComponent} from "../setlist-toc/setlist-toc.component";

@Component({
  selector: 'app-setlist-pages',
  standalone: true,
  imports: [
    StructurePageComponent,
    SetlistTocComponent
  ],
  templateUrl: './setlist-pages.component.html',
  styleUrl: './setlist-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetlistPagesComponent {
  protected setlist: Setlist;

  constructor(
    readonly songRepository: SongRepository,
    readonly title: Title,
  ) {
    title.setTitle('Setlist Didaf\'ta'); // cf. SetlistTocComponent
    this.setlist = Setlist.getSetlist30_05_2025(songRepository); // cf. SetlistTocComponent
  }

}
