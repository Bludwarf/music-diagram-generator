import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SetlistPagesComponent} from './setlist-pages.component';
import {injectSpy, PROVIDER_SPIES} from "../test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import SpyObj = jasmine.SpyObj;

describe('SetlistPagesComponent', () => {
    let component: SetlistPagesComponent;
    let fixture: ComponentFixture<SetlistPagesComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SetlistPagesComponent],
            providers: [
                PROVIDER_SPIES.ActivatedRoute,
            ]
        })
            .compileComponents();

        activatedRoute = injectSpy(ActivatedRoute);
        activatedRoute.queryParams = of({
            title: `Setlist de test`,
        });

        fixture = TestBed.createComponent(SetlistPagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
})
;
