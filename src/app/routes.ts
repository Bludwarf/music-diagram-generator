import {IndexComponent} from "./index/index.component";
import {SongComponent} from "./song/song.component";
import {ConvertComponent} from "./convert/convert.component";
import {ChordsGridComponent} from "./test/chords-grid/chords-grid.component";
import {StructureListComponent} from "./test/structure-list/structure-list.component";
import {SetlistPagesComponent} from "./test/setlist-pages/setlist-pages.component";
import {Routes} from "@angular/router";
import {CreateZipComponent} from "./test/create-zip/create-zip.component";

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'morceaux/:songName', component: SongComponent},
  {path: 'convert', component: ConvertComponent},
  {path: 'test/chords-grid', component: ChordsGridComponent},
  {path: 'test/structure-list', component: StructureListComponent},
  {path: 'test/create-zip', component: CreateZipComponent},
  {path: 'setlist', component: SetlistPagesComponent},
]

export default routes;
