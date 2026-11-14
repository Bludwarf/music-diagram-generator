import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import * as structureJson from './A bout de souffle.json'
import {StructureDto} from "../../structure/structure-dto";

@Component({
    selector: 'app-markdown-structure',
    imports: [
        ReactiveFormsModule,
        FormsModule,
    ],
    standalone: true,
    templateUrl: './markdown-structure.component.html',
    styleUrl: './markdown-structure.component.css',
})
export class MarkdownStructureComponent implements OnInit {
    markdownA = {
        sections: '',
        sectionsPadded: '',
        sectionsPaddedParagraph: '',
    }

    ngOnInit() {
        const structureDto = structureJson as StructureDto;

        const sections = structureDto.parts.flatMap(part => part.sections)

        const maxSectionNameLength = sections.reduce((max, section) => Math.max(max, section.name.length), 0);
        const lines: string [] = [];
        const linesPadded: string [] = [];
        const linesPaddedParagraph: string [] = [];
        for (const section of sections) {
            const initials = section.patternInitials.join(' ');
            lines.push(`${section.name} : ${initials}`)
            linesPadded.push(`${section.name.padEnd(maxSectionNameLength)} : ${initials}`)
            linesPaddedParagraph.push(`${section.name.padEnd(maxSectionNameLength)} : ${initials}`)
            if (section.name === 'Refrain') {
                linesPaddedParagraph.push('')
            }
        }
        this.markdownA.sections = lines.join('\r\n');
        this.markdownA.sectionsPadded = linesPadded.join('\r\n');
        this.markdownA.sectionsPaddedParagraph = linesPaddedParagraph.join('\r\n');
    }

}
