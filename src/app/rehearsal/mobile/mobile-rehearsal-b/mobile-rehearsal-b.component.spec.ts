import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MobileRehearsalBComponent} from './mobile-rehearsal-b.component';
import {buildSongEntry, injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {SongRepository} from "../../../song/song-repository";
import SpyObj = jasmine.SpyObj;
import {DEFAULT_SONG_ENTRY} from "../../../song/song-entry.spec";

describe('MobileRehearsalAComponent', () => {
    let component: MobileRehearsalBComponent;
    let fixture: ComponentFixture<MobileRehearsalBComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;
    let songRepository: SpyObj<SongRepository>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MobileRehearsalBComponent],
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

        songRepository = injectSpy(SongRepository);
        songRepository.requireSongEntry.and.returnValue(Promise.resolve(songEntry));

        fixture = TestBed.createComponent(MobileRehearsalBComponent);
        fixture.componentRef.setInput('songEntry', DEFAULT_SONG_ENTRY);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
