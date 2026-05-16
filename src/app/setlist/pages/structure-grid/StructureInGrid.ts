import {Structure} from "../../../structure/structure";
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {SectionInStructure} from "../../../structure/section/section-in-structure";

export class StructureInGrid {
  partsInGrid: PartInGrid[] = [];

  constructor(
    readonly structure: Structure,
  ) {
    for (const partInStructure of structure.partsInStructure) {
      this.partsInGrid.push(new PartInGrid(this, partInStructure)); // TODO stocker offset
    }
  }

  get width(): number {
    return Math.max(...this.partsInGrid.map(part => part.width));
  }
}

export class PartInGrid {
  sectionsInGrid: SectionInGrid[] = [];

  constructor(
    readonly parent: StructureInGrid,
    readonly partInStructure: PartInStructure,
    readonly startOffset = 0,
  ) {
    for (const sectionInStructure of partInStructure.sectionsInStructure) {
      this.sectionsInGrid.push(new SectionInGrid(this, sectionInStructure));
    }
  }

  /**
   * startOffset compris
   */
  get width(): number {
    return this.startOffset + sum(this.sectionsInGrid.map(section => section.width));
  }

}

export class SectionInGrid {

  constructor(
    readonly parent: PartInGrid,
    readonly sectionInStructure: SectionInStructure,
  ) {
  }

  get width(): number {
    return sum(this.sectionInStructure.patternsInStructure.map(pattern => pattern.eventsDurationInBars));
  }

}

function sum(numbers: number[]): number {
  return numbers.reduce((sum, number) => sum + number, 0);
}
