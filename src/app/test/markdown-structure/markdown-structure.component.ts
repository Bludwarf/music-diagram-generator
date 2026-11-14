import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import * as structureJson from './A bout de souffle.json'
import {StructureDto} from "../../structure/structure-dto";
import {Chords} from "../../notes";

const EMPTY_ASCII_CHORDS_2 = repeatEmptyAsciiChord(2);
const EMPTY_ASCII_CHORDS_4 = repeatEmptyAsciiChord(4);

function repeatEmptyAsciiChord(emptySpaceWidth: number): string {
    return Chords.repeatNoChord(4).ascii.replaceAll(' ', ' '.repeat(emptySpaceWidth));
}

function markdownAEmptyPatterns(emptySpaceWidth: number) {
    const asciiChords = repeatEmptyAsciiChord(emptySpaceWidth)
    return [
        `I Intro   ${asciiChords}`,
        `C Couplet ${asciiChords}`,
        `R Refrain ${asciiChords}`,
        `P Pont    ${asciiChords}`,
        `S Solo    ${asciiChords}`,
        `          ${asciiChords}`,
        `          ${asciiChords}`,
        `          ${asciiChords}`,
    ].join('\r\n')
}

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
        sectionsWithoutPatterns: '',
        sectionsWithPatterns: '',
        patternsMin: markdownAEmptyPatterns(2),
        patternsMax: markdownAEmptyPatterns(5),
        patternsWithChords: [
            'I Intro   | Gm | Cm | Gm  | Cm |',
            'C Couplet | Gm | Cm | Gbm | Dm |',
            'R Refrain | Eb | Bb | F   | F  |',
            'P Pont    |    |    |     |    |',
            'S Solo    | Gm | Gm | Gm  | Gm |',
            '          | Dm | Dm | Dm  | Dm |',
            '          | Cm | Cm | Cm  | Cm |',
            '          | Dm | Dm | D   | D  |',
        ].join('\r\n'),

        patternsUtfMin: markdownAEmptyPatterns(2),
        patternsUtfMax: markdownAEmptyPatterns(5),
        patternsUtfWithChords: [
            '          ┌────┬────┬─────┬────┐',
            '  I Intro │ Gm │ Cm │ Gm  │ Cm │',
            '          ├────┼────┼─────┼────┤',
            'C Couplet │ Gm │ Cm │ Gbm │ Dm │',
            '          ├────┼────┼─────┼────┤',
            'R Refrain │ Eb │ Bb │ F   │ F  │',
            '          ├────┼────┼─────┼────┤',
            '   P Pont │    │    │     │    │',
            '          ├────┼────┼─────┼────┤',
            '   S Solo │ Gm │ Gm │ Gm  │ Gm │',
            '          ├────┼────┼─────┼────┤',
            '          │ Dm │ Dm │ Dm  │ Dm │',
            '          ├────┼────┼─────┼────┤',
            '          │ Cm │ Cm │ Cm  │ Cm │',
            '          ├────┼────┼─────┼────┤',
            '          │ Dm │ Dm │ D   │ D  │',
            '          └────┴────┴─────┴────┘',
        ].join('\r\n'),

        patternsMinWithChords: [
            'I Intro Gm Cm Gm  Cm',
            'C Couplet Gm Cm Gbm Dm',
            'C\' Couplet\' Gm Cm Gbm Am',
            'R Refrain Eb Bb F   F ',
            'P Pont 4m',
            'S Solo Gm Gm Gm Gm',
            '       Dm Dm Dm Dm',
            '       Cm Cm Cm Cm',
            '       Dm Dm D D ',
        ].join('\r\n'),
        patternsMinAlignedWithChords: [
            'Intro    Gm Cm Gm  Cm',
            'Couplet  Gm Cm Gbm Dm',
            'Couplet\' Gm Cm Gbm Am',
            'Refrain  Eb Bb F   F ',
            'Pont     4m',
            'Solo     Gm Gm Gm  Gm',
            '         Dm Dm Dm  Dm',
            '         Cm Cm Cm  Cm',
            '         Dm Dm D   D ',
        ].join('\r\n'),
    }

    ngOnInit() {
        const structureDto = structureJson as StructureDto;

        const sections = structureDto.parts.flatMap(part => part.sections)

        const maxSectionNameLength = sections.reduce((max, section) => Math.max(max, section.name.length), 0);
        const linesS: string [] = [];
        const linesSP: string [] = [];
        for (const section of sections) {
            const initials = section.patternInitials.join(' ');
            linesS.push(`${section.name.padEnd(maxSectionNameLength)} : `)
            linesSP.push(`${section.name.padEnd(maxSectionNameLength)} : ${initials}`)
            if (section.name === 'Refrain') {
                linesS.push('')
                linesSP.push('')
            }
        }

        this.markdownA.sectionsWithoutPatterns = linesS.join('\r\n');
        this.markdownA.sectionsWithPatterns = linesSP.join('\r\n');
    }

}
