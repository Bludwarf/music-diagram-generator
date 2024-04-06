import {Component} from '@angular/core';
import convert from "xml-js";
import {FormsModule} from "@angular/forms";
import {AlsImporter} from "../als/als-importer";
import {AlsExtractor} from "../als/als-extractor";
import {JsonPipe, NgIf} from "@angular/common";
import {RecordingInitData} from "../recording/recording";

const songEntryTemplate = ''

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    JsonPipe
  ],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss'
})
export class ConvertComponent {

  jsonContent?: string
  jsonStructure?: string;
  recordingInitData?: RecordingInitData;
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
    const structureExtractor = new AlsExtractor(alsProject);
    this.jsonStructure = JSON.stringify(structureExtractor.extractStructureObject(), undefined, 4)
    this.recordingInitData = structureExtractor.extractRecordingInitData()

    this.songName = xmlFile.name.substring(0, xmlFile.name.indexOf('.'))
  }

  get songName(): string | undefined {
    return this._songName
  }

  set songName(songName: string) {
    this._songName = songName
    const recordingName = this.recordingInitData?.name ?? prompt('recording.name')
    this.songEntry = `
    import { Key } from "../../notes";
    import recordingInitData from "../../../assets/recordings/${recordingName}.json";
    import { Pattern } from "../../structure/pattern/pattern";
    import { Recording } from "../../recording/recording";
    import { Structure } from "../../structure/structure";
    import { Section } from "../../structure/section/section";
    import { Part } from "../../structure/part/part";
    
    const key = Key.Gm
    const fretboard = {
        lowestFret: 0,
        fretsCount: 5,
    }
    
    const C = Pattern.fromData({
        key,
        name: 'Couplet',
        chords: '| A | C | G | F |',
        fretboard,
    })
    
    const R = Pattern.fromData({
        key,
        name: 'Refrain',
        chords: '| A | E | F | G |',
        fretboard,
    })
    
    const couplet = new Section('Couplet', [C, C, C, C])
    const refrain = new Section('Refrain', [R, R])
    
    const parts: Part[] = [
        new Part('1', [couplet, refrain]),
        new Part('2', [couplet, refrain]),
    ]
    
    const structure = Structure.builder()
        .parts(parts)
        .build()
    
    const recording = Recording.builder()
        .initData(recordingInitData)
        .build()
    
    export default {
        name: '${songName}',
        structure,
        recording,
    }    
`
  }
}
