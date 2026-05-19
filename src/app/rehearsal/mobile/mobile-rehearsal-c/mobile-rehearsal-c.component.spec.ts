import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MobileRehearsalCComponent} from './mobile-rehearsal-c.component';
import {buildSongEntry, injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {SongRepository} from "../../../song/song-repository";
import SpyObj = jasmine.SpyObj;

describe('MobileRehearsalAComponent', () => {
    let component: MobileRehearsalCComponent;
    let fixture: ComponentFixture<MobileRehearsalCComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;
    let songRepository: SpyObj<SongRepository>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MobileRehearsalCComponent],
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

        fixture = TestBed.createComponent(MobileRehearsalCComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
