import { ChangeDetectionStrategy, Component } from '@angular/core';
import {Setlist} from "../setlist-pages/setlist";
import {SongRepository} from "../../song/song-repository";
import {Title} from "@angular/platform-browser";
import {PageComponent} from "../page/page.component";

@Component({
  selector: 'app-setlist-toc',
  standalone: true,
  imports: [
    PageComponent
  ],
  templateUrl: './setlist-toc.component.html',
  styleUrl: './setlist-toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetlistTocComponent {
  protected setlist: Setlist;

  constructor(
    readonly songRepository: SongRepository,
    readonly title: Title,
  ) {
    title.setTitle('Setlist Didaf\'ta'); // TODO facto avec SetlistPagesComponent
    this.setlist = Setlist.getSetlist30_05_2025(songRepository); // TODO facto avec SetlistPagesComponent
  }

}
