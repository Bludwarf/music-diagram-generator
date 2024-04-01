import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRehearsalAComponent } from './mobile-rehearsal-a.component';
import {injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import SpyObj = jasmine.SpyObj;
import {of} from "rxjs";

describe('MobileRehearsalAComponent', () => {
  let component: MobileRehearsalAComponent;
  let fixture: ComponentFixture<MobileRehearsalAComponent>;
  let activatedRoute: SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRehearsalAComponent],
      providers: [
        PROVIDER_SPIES.ActivatedRoute,
      ]
    })
    .compileComponents();

    activatedRoute = injectSpy(ActivatedRoute);
    activatedRoute.params = of({
      songName: 'Petit Papillon',
    });
    
    fixture = TestBed.createComponent(MobileRehearsalAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
