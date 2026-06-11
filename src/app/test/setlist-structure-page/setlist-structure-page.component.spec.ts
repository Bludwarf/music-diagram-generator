import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SetlistStructurePageComponent} from './setlist-structure-page.component';
import {ActivatedRoute} from "@angular/router";
import {injectSpy, PROVIDER_SPIES} from "../test-utils";
import {of} from "rxjs";
import SpyObj = jasmine.SpyObj;

describe('SetlistStructurePageComponent', () => {
    let component: SetlistStructurePageComponent;
    let fixture: ComponentFixture<SetlistStructurePageComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SetlistStructurePageComponent],
            providers: [
                PROVIDER_SPIES.ActivatedRoute,
            ],
        })
            .compileComponents();

        activatedRoute = injectSpy(ActivatedRoute);
        activatedRoute.data = of({
            setlist: undefined,
        });

        fixture = TestBed.createComponent(SetlistStructurePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
