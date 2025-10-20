import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MobileRehearsalPComponent} from './mobile-rehearsal-p.component';
import {injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import SpyObj = jasmine.SpyObj;

describe('MobileRehearsalPComponent', () => {
  let component: MobileRehearsalPComponent;
  let fixture: ComponentFixture<MobileRehearsalPComponent>;
  let activatedRoute: SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRehearsalPComponent],
      providers: [
        PROVIDER_SPIES.ActivatedRoute,
      ]
    })
      .compileComponents();

    activatedRoute = injectSpy(ActivatedRoute);
    activatedRoute.params = of({
      songName: 'Petit Papillon',
    });

    fixture = TestBed.createComponent(MobileRehearsalPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
