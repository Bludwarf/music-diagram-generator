import {BeatTime, Time} from "../time";

export abstract class Region<I, T extends Time = BeatTime> {
    constructor(
        // inclue
        readonly start: T,
        readonly item: I,
        // exclue
        readonly end: T,
    ) {
    }

    abstract getTime(item: I): T;

    intersects(region: Region<any, T>): boolean {
        return this.start.value < region.end.value
            && region.start.value < this.end.value
            || this.start.value == region.start.value;
    }
}

interface RegionConstructor<I, R extends Region<I, T>, T extends Time = BeatTime> {
    new(start: T, element: I, end: T): R;

    prototype: R;
}

// export function createRegionsFromV1<T>(elements: T[], getTime: (e: T) => number, sort = true): Region<T>[] {
//     const sortedElements = sort ? [... elements].sort((a, b) => getTime(a) - getTime(b)) : elements;
//     const regions: Region<T>[] = []
//     for (let endIndex = 1; endIndex < sortedElements.length; ++endIndex) {
//         const currentElement = sortedElements[endIndex - 1];
//         const start = getTime(currentElement);
//         const end = getTime(sortedElements[endIndex]);
//         regions.push(new Region(start, currentElement, end))
//     }
//     return regions;
// }

export function createRegionsFrom<I, R extends Region<I, T>, T extends Time = BeatTime>(items: I[], type: RegionConstructor<I, R, T>, endTime: T, sort = true): R[] {
    // on appelle via type.prototype.getTime(...) pour garder le bon `this`
    const getTime = (item: I) => type.prototype.getTime(item);

    const sortedElements = sort ? [...items].sort((a, b) => getTime(a).value - getTime(b).value) : items;

    const regions: R[] = []
    for (let endIndex = 1; endIndex < sortedElements.length; ++endIndex) {
        const currentItem = sortedElements[endIndex - 1];
        const start = getTime(currentItem);
        const end = getTime(sortedElements[endIndex]);
        regions.push(new type(start, currentItem, end))
    }

    const lastItem = items.at(-1)!
    regions.push(new type(getTime(lastItem), lastItem, endTime));

    return regions;
}

// export function getRegionAt<T>(value: number, regions: Region<T>[], getRegionValue: (region: T) => number): Region<T> {
//     return regions.find(region => value < getRegionValue(region.end)) ?? regions.at(-1)!;
// }

export function groupByRegion<C extends Region<U>, U, R extends Region<T>, T>(children: C[], regions: R[]): Map<R, C[]> {
    const childrenByRegion: Map<R, C[]> = new Map();

    let currentChildIndex = 0;
    for (const region of regions) {
        if (!(childrenByRegion.has(region))) {
            childrenByRegion.set(region, []);
        }

        let continueToNextChild: boolean;
        do {
            const currentChild = children[currentChildIndex];
            if (currentChild) {
                if (region.intersects(currentChild)) {
                    childrenByRegion.get(region)!.push(currentChild)
                    continueToNextChild = currentChild.end.value < region.end.value;
                } else {
                    continueToNextChild = true;
                }
            } else {
                continueToNextChild = false;
            }
            if (continueToNextChild) {
                ++currentChildIndex;
            }
        } while (continueToNextChild)

        // TODO break si plus d'enfant
    }

    const remainingChildren = children.slice(currentChildIndex);
    if (remainingChildren.length) {
        console.warn(`Les régions enfants suivantes n'ont pas été regroupées`, remainingChildren);
    }

    return childrenByRegion;
}
