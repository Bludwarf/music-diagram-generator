import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRehearsalBComponent } from './mobile-rehearsal-b.component';
import {injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import SpyObj = jasmine.SpyObj;
import {of} from "rxjs";

describe('MobileRehearsalAComponent', () => {
  let component: MobileRehearsalBComponent;
  let fixture: ComponentFixture<MobileRehearsalBComponent>;
  let activatedRoute: SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRehearsalBComponent],
      providers: [
        PROVIDER_SPIES.ActivatedRoute,
      ]
    })
    .compileComponents();

    activatedRoute = injectSpy(ActivatedRoute);
    activatedRoute.params = of({
      songName: 'Petit Papillon',
    });
    
    fixture = TestBed.createComponent(MobileRehearsalBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
