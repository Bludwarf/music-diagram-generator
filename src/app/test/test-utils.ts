import {ActivatedRoute} from "@angular/router";
import {ProviderToken} from "@angular/core";
import {TestBed} from "@angular/core/testing";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

// Source : https://stackoverflow.com/a/57331494/1655155
export function getKarmaFile(filePath: string): Promise<Blob> {
  return new Promise((resolve) => {
    const request: XMLHttpRequest = createGetKarmaFileRequest(filePath);

    request.onload = async r => {
      const blob = new Blob([request.response]);
      resolve(blob)
    };

    // trigger
    request.send(null);
  })
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
    ] as (keyof ActivatedRoute)[]),
  },
}

export function injectSpy<T>(token: ProviderToken<T>): SpyObj<T> {
  return TestBed.inject(token) as SpyObj<T>;
}
