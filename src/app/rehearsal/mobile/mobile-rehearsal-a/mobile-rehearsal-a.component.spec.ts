import {ComponentFixture, TestBed} from '@angular/core/testing';

import {buildSongEntry, injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {MobileRehearsalAComponent} from "./mobile-rehearsal-a.component";
import {SongRepository} from "../../../song/song-repository";
import SpyObj = jasmine.SpyObj;

describe('MobileRehearsalAComponent', () => {
    let component: MobileRehearsalAComponent;
    let fixture: ComponentFixture<MobileRehearsalAComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;
    let songRepository: SpyObj<SongRepository>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MobileRehearsalAComponent],
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
        songRepository.requireSongEntry.and.returnValue(songEntry);

        fixture = TestBed.createComponent(MobileRehearsalAComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create 2', () => {
        expect(component).toBeTruthy();
    });
});
