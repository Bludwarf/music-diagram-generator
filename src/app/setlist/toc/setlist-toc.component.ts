import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Setlist} from "../setlist";
import {Title} from "@angular/platform-browser";
import {PageComponent} from "../../page/page.component";

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
  get setlist(): Setlist {
    return this._setlist;
  }

  @Input({required: true})
  set setlist(value: Setlist) {
    this._setlist = value;
    this.title.setTitle(this._setlist.title);
  }

  private _setlist!: Setlist;

  constructor(
    readonly title: Title,
  ) {
  }

  round = Math.round

}
