import {ComponentFixture, TestBed} from '@angular/core/testing';

import {injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {MobileRehearsalPOsmdComponent} from "./mobile-rehearsal-p-osmd.component";
import SpyObj = jasmine.SpyObj;

describe('MobileRehearsalPOsmdComponent', () => {
  let component: MobileRehearsalPOsmdComponent;
  let fixture: ComponentFixture<MobileRehearsalPOsmdComponent>;
  let activatedRoute: SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRehearsalPOsmdComponent],
      providers: [
        PROVIDER_SPIES.ActivatedRoute,
      ]
    })
      .compileComponents();

    activatedRoute = injectSpy(ActivatedRoute);
    activatedRoute.params = of({
      songName: 'Petit Papillon',
    });

    fixture = TestBed.createComponent(MobileRehearsalPOsmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
