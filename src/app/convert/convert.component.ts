import {Component} from '@angular/core';
import convert from "xml-js";
import {FormsModule} from "@angular/forms";
import {AlsImporter} from "../als/als-importer";
import {StructureExtractorFromAls} from "../als/structure-extractor-from-als";
import {NgIf} from "@angular/common";

const songEntryTemplate = ''

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss'
})
export class ConvertComponent {

  jsonContent?: string
  jsonStructure?: string;
  songEntry?: string;

  _songName?: string

  constructor(
    private readonly alsImporter: AlsImporter,
  ) {
  }

  async uploadFile(event: Event): Promise<void> {

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList?.length) {
      return;
    }

    const xmlFile = fileList[0]
    const xmlContent = await xmlFile.text()
    const jsonContent = convert.xml2json(xmlContent, {
      compact: true,
    })

    this.jsonContent = jsonContent

    const alsProject = this.alsImporter.loadJsonContent(jsonContent);
    const structureExtractor = new StructureExtractorFromAls(alsProject);
    this.jsonStructure = JSON.stringify(structureExtractor.toStructureObject(), undefined, 4)

    this.songName = xmlFile.name.substring(0, xmlFile.name.indexOf('.'))
  }

  get songName(): string | undefined {
    return this._songName
  }

  set songName(songName: string) {
    this._songName = songName
    this.songEntry = `
import {Key} from "../../notes";
import stuctureObject from "../../../assets/structures/${songName}.json";
import {Pattern} from "../../structure/pattern/pattern";
import {Structure} from "../../structure/structure";

const key = Key.Gm
const fretboard = {
  lowestFret: 0,
  fretsCount: 5,
}

const couplet = Pattern.fromData({
  key,
  name: 'Couplet',
  chords: '| A | C | G | F |',
  fretboard,
})

const refrain = Pattern.fromData({
  key,
  name: 'Refrain',
  chords: '| A | E | F | G |',
  fretboard,
})

const ligne1 = [couplet, couplet, refrain,]

const patterns: Pattern[] = [
  ...ligne1,
]

const structure = Structure.builder()
  .stuctureObject(stuctureObject)
  .patterns(patterns)
  .build()

export default {
  name: '${songName}',
  structure,
}
`
  }
}
