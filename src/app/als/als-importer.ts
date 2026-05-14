import {AlsProject} from "./v10/als-project";
import {checkXmlContent} from "../xml/xml-js-utils";

import {xml2json} from 'xml-js';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AlsImporter {

  async load(alsFile: Blob): Promise<AlsProject> {
    const unzipped = await this.unzip(alsFile);
    return this.loadUnzipped(unzipped);
  }

  // Source : https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
  private async unzip(blob: Blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    const uncompressed = await new Response(decompressedStream).blob();
    console.log('uncompressed', uncompressed);
    return uncompressed;
  }

  private async loadUnzipped(xmlFile: Blob): Promise<AlsProject> {
    // TODO utiliser plutôt des stream
    const xmlContent = await xmlFile.text()
    return this.loadXmlContent(xmlContent)
  }

  private loadXmlContent(xmlContent: string): AlsProject {
    checkXmlContent(xmlContent);
    const jsonContent = xml2json(xmlContent, {
      compact: true,
    })
    return this.loadJsonContent(jsonContent)
  }

  private loadJsonContent(jsonContent: string): AlsProject {
    return new AlsProject(JSON.parse(jsonContent))
  }

}
