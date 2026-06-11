import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {StructurePageComponent} from "../../setlist/pages/structure-page/structure-page.component";
import {Setlist} from "../../setlist/setlist";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-setlist-structure-page',
    standalone: true,
    imports: [
        StructurePageComponent,
    ],
    templateUrl: './setlist-structure-page.component.html',
    styleUrl: './setlist-structure-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetlistStructurePageComponent implements OnInit {

    protected setlist?: Setlist;


    constructor(
        private readonly route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: any) => {
            this.setlist = data.setlist;
        });
    }
}
