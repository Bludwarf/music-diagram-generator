import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import * as structureJson from './A bout de souffle.json'
import {PatternDto, SectionDto, StructureDto} from "../../structure/structure-dto";
import {Chords} from "../../notes";

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
        sectionsWithPatternsBr: '',

        patternsA: '',
        patternsABr: '',
        patternsAWithChords: '',
        patternsABrWithChords: '',

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

        patternsMinWithChords:'',
        patternsMinWithChordsBy4:'',
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

        this.markdownA.sectionsWithoutPatterns = new AsciiSectionParserAS().toAscii(structureDto);
        this.markdownA.sectionsWithPatterns = new AsciiSectionParserASP().toAscii(structureDto);
        this.markdownA.sectionsWithPatternsBr = new AsciiSectionParserASPBr().toAscii(structureDto);

        this.markdownA.patternsA = new AsciiPatternParserA().toAscii(structureDto, true);
        this.markdownA.patternsAWithChords = new AsciiPatternParserA().toAscii(structureDto, false);

        this.markdownA.patternsABr = new AsciiPatternParserABr().toAscii(structureDto, true);
        this.markdownA.patternsABrWithChords = new AsciiPatternParserABr().toAscii(structureDto, false);

        this.markdownA.patternsMinWithChords = new AsciiPatternParserMin().toAscii(structureDto, false);
        this.markdownA.patternsMinWithChordsBy4 = new AsciiPatternParserMinBy4().toAscii(structureDto, false);
    }

}

abstract class AsciiSectionParser {
    toAscii(structureDto: StructureDto): string {
        const sections = structureDto.parts.flatMap(part => part.sections)

        const maxNameLength = sections.reduce((max, section) => Math.max(max, section.name.length), 0);
        const linesS: string [] = [];
        for (const section of sections) {
            linesS.push(this.sectionToAscii(section, maxNameLength))
            if (section.name === 'Refrain') {
                linesS.push('')
            }
        }

        return linesS.join('\r\n');
    }

    protected abstract sectionToAscii(section: SectionDto, maxSectionNameLength: number): string;
}

class AsciiSectionParserAS extends AsciiSectionParser {
    protected sectionToAscii(section: SectionDto, maxSectionNameLength: number): string {
        return `${section.name.padEnd(maxSectionNameLength)} : `;
    }
}

class AsciiSectionParserASP extends AsciiSectionParser {
    protected sectionToAscii(section: SectionDto, maxSectionNameLength: number): string {
        const initials = section.patternInitials.join(' ');
        return `${section.name.padEnd(maxSectionNameLength)} : ${initials}`;
    }
}

class AsciiSectionParserASPBr extends AsciiSectionParser {
    protected sectionToAscii(section: SectionDto, maxSectionNameLength: number): string {
        const initials = section.patternInitials.join(' ');
        return `${section.name.padEnd(maxSectionNameLength)}\r\n${initials}\r\n`;
    }
}

abstract class AsciiPatternParser {
    toAscii(structureDto: StructureDto, emptyChords: boolean): string {
        const patterns = structureDto.patterns

        const maxInitAndNameLength = patterns.reduce((max, section) => Math.max(max, section.initial.length + 1 + section.name.length), 0);
        const linesS: string [] = [];
        for (const pattern of patterns) {
            const asciiChords = emptyChords ? repeatEmptyAsciiChord(2) : pattern.asciiChords ?? repeatEmptyAsciiChord(2)
            linesS.push(this.patternToAscii(pattern, maxInitAndNameLength, asciiChords))
        }

        return linesS.join('\r\n');
    }

    protected abstract patternToAscii(pattern: PatternDto, maxInitAndNameLength: number, asciiChords: string): string;
}

class AsciiPatternParserA extends AsciiPatternParser {
    protected patternToAscii(pattern: PatternDto, maxInitAndNameLength: number, asciiChords: string): string {
        const initAndName = `${pattern.initial} ${pattern.name}`.padEnd(maxInitAndNameLength);
        return `${initAndName} ${asciiChords}`;
    }
}

class AsciiPatternParserABr extends AsciiPatternParser {
    protected patternToAscii(pattern: PatternDto, maxInitAndNameLength: number, asciiChords: string): string {
        const asciiChordsBy4 = groupAsciiChordsBy4(asciiChords, true);
        return `${pattern.initial} ${pattern.name}\r\n${asciiChordsBy4}\r\n`;
    }
}

class AsciiPatternParserMin extends AsciiPatternParser {
    protected patternToAscii(pattern: PatternDto, maxInitAndNameLength: number, asciiChords: string): string {
        const minAsciiChords = asciiChords
            .replaceAll('|', '')
            .replaceAll('  ', ' ')
            .trim();
        return `${pattern.initial} ${pattern.name}\r\n${minAsciiChords}\r\n`;
    }
}

class AsciiPatternParserMinBy4 extends AsciiPatternParser {
    protected patternToAscii(pattern: PatternDto, maxInitAndNameLength: number, asciiChords: string): string {
        return `${pattern.initial} ${pattern.name}\r\n${groupAsciiChordsBy4(asciiChords, false)}\r\n`;
    }
}

function groupAsciiChordsBy4(asciiChords: string, barMark: boolean): string {
    const separatorWithSpaces = barMark ? ' | ' : undefined;
    const minAsciiChords = asciiChords
        .replaceAll('|', '')
        .trim()
        .split(/ +/)
    const minAsciiChordsStrings: string[] = [];
    for (let i = 0; i < minAsciiChords.length; i += 4) {
        const group: string[] = [];
        for (let j = 0; j < 4; j++) {
            const k = i + j;
            if (k < minAsciiChords.length) {
                group.push(minAsciiChords[k]);
            }
        }
        let groupLine = group.join(separatorWithSpaces ?? ' ');
        if (barMark) {
            groupLine = `| ${groupLine} |`;
        }
        minAsciiChordsStrings.push(groupLine);
    }
    return minAsciiChordsStrings.join('\r\n')
}
