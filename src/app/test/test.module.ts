import {ChordsGridComponent} from "./chords-grid/chords-grid.component";
import {StructureListComponent} from "./structure-list/structure-list.component";
import {CreateZipComponent} from "./create-zip/create-zip.component";
import {RouterModule, Routes} from "@angular/router";
import {inject, NgModule} from "@angular/core";
import {SetlistStructurePageComponent} from "./setlist-structure-page/setlist-structure-page.component";
import {TestSongRepository} from "./test-song-repository";
import {TestComponent} from "./test.component";
import {Setlist} from "../setlist/setlist";
import {TEST_PATHS_MAP} from "./test-paths";

const routes: Routes = [
    {
        path: '',
        component: TestComponent,
    },
    {
        path: TEST_PATHS_MAP['chords-grid'],
        component: ChordsGridComponent,
    },
    {
        path: TEST_PATHS_MAP['structure-list'],
        component: StructureListComponent,
    },
    {
        path: TEST_PATHS_MAP['create-zip'],
        component: CreateZipComponent,
    },
    {
        path: TEST_PATHS_MAP['setlist-structure-page'],
        component: SetlistStructurePageComponent,
        resolve: {
            setlist: () => {
                const testSongRepository = inject(TestSongRepository);
                return Setlist.from("Tests", undefined, testSongRepository, ["setlist-structure-page"]);
            },
        },
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [
        TestSongRepository,
    ],
})
export class TestModule {

    constructor() {
        console.log(`Chargement du module "test"`)
    }
}
