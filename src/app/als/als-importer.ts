// import * as zip from "@zip.js/zip.js";
// import {ZipReaderConstructorOptions} from "@zip.js/zip.js";
// const abletonParser = require('ableton-parser');

// const unzip = require('unzip-js')

import {AlsProject} from "./v10/als-project";
import {checkXmlContent} from "../xml/xml-js-utils";

import * as convert from 'xml-js';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
// TODO trouver un utilitaire pour dézipper côté client
export class AlsImporter {

  // async load(file: Blob): Promise<void> {
  //   console.log(file.size)
  //   const options: ZipReaderConstructorOptions = {} as ZipReaderConstructorOptions
  //
  //   // Source : https://github.com/gildas-lormeau/zip.js/blob/gh-pages/demos/demo-read-file.js
  //
  //   const blobReader = new zip.BlobReader(file);
  //   console.log('blobReader', blobReader)
  //
  //   const zipReader = new zip.ZipReader(blobReader);
  //   console.log('zipReader', zipReader)
  //
  //   const entries = await zipReader.getEntries(options)
  //   console.log(entries)
  // }

  // load(file: Blob) {
  //   unzip(file, function (err: any, zipFile: any) {
  //     if (err) {
  //       return console.error(err)
  //     }
  //
  //     zipFile.readEntries(function (err: any, entries: any) {
  //       if (err) {
  //         return console.error(err)
  //       }
  //
  //       entries.forEach(function (entry: any) {
  //         zipFile.readEntryData(entry, false, function (err: any, readStream: any) {
  //           if (err) {
  //             return console.error(err)
  //           }
  //
  //           readStream.on('data', function (chunk: any) {
  //           })
  //           readStream.on('error', function (err: any) {
  //           })
  //           readStream.on('end', function () {
  //           })
  //         })
  //       })
  //     })
  //   })
  // }

  async loadUnzipped(xmlFile: Blob): Promise<AlsProject> {
    // TODO utiliser plutôt des stream
    const xmlContent = await xmlFile.text()
    return this.loadXmlContent(xmlContent)
  }

  loadXmlContent(xmlContent: string): AlsProject {
    checkXmlContent(xmlContent);
    const jsonContent = convert.xml2json(xmlContent, {
      compact: true,
    })
    return this.loadJsonContent(jsonContent)
  }

  loadJsonContent(jsonContent: string): AlsProject {
    return new AlsProject(JSON.parse(jsonContent))
  }

}
