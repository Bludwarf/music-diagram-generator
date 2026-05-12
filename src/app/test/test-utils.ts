import {ActivatedRoute} from "@angular/router";
import {ProviderToken} from "@angular/core";
import {TestBed} from "@angular/core/testing";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {SongRepository} from "../song/song-repository";
import {SongEntry} from "../song/song-entry";
import {Structure} from "../structure/structure";

// Source : https://stackoverflow.com/a/57331494/1655155
/**
 * @param filePath Doit être déclaré dans "files" du fichier karma.conf.js
 */
export function getKarmaFile(filePath: string, fileName = filePath): Promise<File> {
    return new Promise((resolve, reject) => {
        const request = createGetKarmaFileRequest(filePath);

        request.onload = () => {
            if (request.status !== 200) {
                reject(new Error(`Failed to load ${filePath}: ${request.status}`));
                return;
            }
            const file = new File([request.response], fileName, {type: 'application/zip'})
            resolve(file);
        };

        request.onerror = () => reject(new Error(`Network error loading ${filePath}`));
        request.send(null);
    });
}

function createGetKarmaFileRequest(filePath: string): XMLHttpRequest {
    const request = new XMLHttpRequest();
    request.open('GET', 'base/' + filePath, true);
    request.responseType = 'arraybuffer'; // maybe also 'text'
    return request;
}

export const PROVIDER_SPIES = {
    ActivatedRoute: {
        provide: ActivatedRoute,
        useValue: createSpyObj<ActivatedRoute>('ActivatedRoute', [
            'params',
            'queryParams',
        ]),
    },
    SongRepository: {
        provide: SongRepository,
        useValue: createSpyObj<SongRepository>('SongRepository', [
            'requireSongEntry',
        ]),
    },
}

export function injectSpy<T>(token: ProviderToken<T>): SpyObj<T> {
    return TestBed.inject(token) as SpyObj<T>;
}

export function createSpyHTMLElement(): SpyObj<HTMLElement> {
    return createSpyObj<HTMLElement>('HTMLElement', [
        'getBoundingClientRect',
    ])
}

export function buildSongEntry(): SongEntry {
    return {
        name: "Morceau de test",
        structure: new Structure([]),
    }
}
