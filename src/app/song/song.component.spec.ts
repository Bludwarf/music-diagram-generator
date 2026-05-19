import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SongComponent} from './song.component';
import {ActivatedRoute} from "@angular/router";
import {buildSongEntry, injectSpy, PROVIDER_SPIES} from "../test/test-utils";
import {of} from "rxjs";
import {SongRepository} from "./song-repository";
import SpyObj = jasmine.SpyObj;

describe('SongComponent', () => {
    let component: SongComponent;
    let fixture: ComponentFixture<SongComponent>;

    let activatedRoute: SpyObj<ActivatedRoute>;
    let songRepository: SpyObj<SongRepository>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SongComponent],
            providers: [
                PROVIDER_SPIES.ActivatedRoute,
                PROVIDER_SPIES.SongRepository,
            ]
        })
            .compileComponents();

        const songEntry = buildSongEntry();

        activatedRoute = injectSpy(ActivatedRoute);
        activatedRoute.params = of({
            songName: songEntry.name,
        });
        activatedRoute.queryParams = of({});

        songRepository = injectSpy(SongRepository);
        songRepository.requireSongEntry.and.returnValue(Promise.resolve(songEntry));

        fixture = TestBed.createComponent(SongComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
