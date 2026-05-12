import {AlsProject} from "./v10/als-project";
import {checkXmlContent} from "../xml/xml-js-utils";

import {xml2json} from 'xml-js';
import {Injectable} from "@angular/core";
import {unzip} from "../utils/file-utils";

@Injectable({
  providedIn: 'root'
})
export class AlsImporter {

  async load(alsFile: Blob): Promise<AlsProject> {
    const unzipped = await unzip(alsFile);
    return this.loadUnzipped(unzipped);
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
