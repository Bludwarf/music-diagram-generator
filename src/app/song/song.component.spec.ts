import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongComponent } from './song.component';
import {ActivatedRoute} from "@angular/router";
import SpyObj = jasmine.SpyObj;
import {injectSpy, PROVIDER_SPIES} from "../test/test-utils";
import {of} from "rxjs";

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  let activatedRoute: SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongComponent],
      providers: [
        PROVIDER_SPIES.ActivatedRoute,
      ]
    })
    .compileComponents();

    activatedRoute = injectSpy(ActivatedRoute);
    activatedRoute.params = of({
      songName: 'Petit Papillon',
    });

    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
