import {ComponentFixture, TestBed} from '@angular/core/testing';

import {buildSongEntry, injectSpy, PROVIDER_SPIES} from "../../../test/test-utils";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {MobileRehearsalPOsmdComponent} from "./mobile-rehearsal-p-osmd.component";
import {SongRepository} from "../../../song/song-repository";
import SpyObj = jasmine.SpyObj;

describe('MobileRehearsalPOsmdComponent', () => {
    let component: MobileRehearsalPOsmdComponent;
    let fixture: ComponentFixture<MobileRehearsalPOsmdComponent>;
    let activatedRoute: SpyObj<ActivatedRoute>;
    let songRepository: SpyObj<SongRepository>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MobileRehearsalPOsmdComponent],
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

        fixture = TestBed.createComponent(MobileRehearsalPOsmdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
