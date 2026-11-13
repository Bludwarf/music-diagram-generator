import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AlsImporter} from "../als/als-importer";
import {AlsExtractor} from "../als/als-extractor";
import {JsonPipe} from "@angular/common";
import {RecordingDto} from "../recording/recording-dto";
import {StructureDto} from "../structure/structure-dto";
import {StructureMapper} from "../json/parsers/structure-mapper.service";

@Component({
    selector: 'app-convert',
    standalone: true,
    imports: [
        FormsModule,
        JsonPipe,
    ],
    templateUrl: './convert.component.html',
    styleUrl: './convert.component.scss',
})
export class ConvertComponent {

    recordingDto?: RecordingDto;
    structureDto?: StructureDto;

    _songName?: string

    constructor(
        private readonly alsImporter: AlsImporter,
        private readonly structureMapper: StructureMapper,
    ) {
    }

    async uploadFile(event: Event): Promise<void> {

        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (!fileList?.length) {
            return;
        }

        const alsFile = fileList[0]
        const alsProject = await this.alsImporter.load(alsFile);

        const structureExtractor = new AlsExtractor(alsProject);
        // this.jsonStructure = JSON.stringify(structureExtractor.extractStructureObject(), undefined, 4)
        this.recordingDto = structureExtractor.extractRecordingDto()

        // const structure = structureExtractor.extractStructure();
        // this.structureDto = this.structureMapper.dto(structure);
        const sections = structureExtractor.extractSections();
        const patterns = structureExtractor.extractPatternDtoArray();
        this.structureDto = {
            parts: [
                {
                    name: '1',
                    sections: sections.map(section => ({
                        name: section.name,
                        patternInitials: [],
                    })),
                },
            ],
            patterns,
        }

        this.songName = alsFile.name.substring(0, alsFile.name.indexOf('.'))
    }

    get songName(): string | undefined {
        return this._songName
    }

    set songName(songName: string) {
        this._songName = songName
    }
}
