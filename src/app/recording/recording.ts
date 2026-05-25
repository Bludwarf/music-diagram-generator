import {BeatTime, SecTime} from "../time";
import {WarpMarker} from "../structure/warp-marker";
import {error, sum} from "../utils";

type WarpMarkerField = keyof WarpMarker;

export class Recording {

    constructor(
        /** Nom du fichier sans extension */
        readonly name: string,
        readonly sampleDurationInSeconds: number,
        readonly warpMarkers: WarpMarker[],
    ) {
        if (!sampleDurationInSeconds) error(`L'enregistrement ${name} doit définir son sampleDurationInSeconds`);
        if (!(warpMarkers?.length >= 2)) error(`L'enregistrement ${name} doit contenir au moins deux WarpMarkers`)
    }

    /**
     * On ignore tout ce qu'il y a avant le premier warpMarker et après le dernier.
     * On calcule la moyenne pondérée par le temps (secTime) des tempos entre chaque warpMarker.
     * @return le tempo moyen en BPM
     */
    get meanTempo(): number {
        const weightedBps = this.regions
            .map(region => region.bps * region.secDuration)
            .reduce((accumulator, element) => sum(accumulator, element), 0)
        const start = this.warpMarkers[0];
        const end = this.warpMarkers.at(-1)!;
        return weightedBps / (end.secTime - start.secTime) * 60
    }

    private _regions?: Region[]
    get regions() {
        if (!this._regions) {
            const regions: Region[] = []
            for (let endIndex = 1; endIndex < this.warpMarkers.length; ++endIndex) {
                const start = this.warpMarkers[endIndex - 1];
                const end = this.warpMarkers[endIndex];
                regions.push(new Region(start, end))
            }
            if (regions.length === 0) error(`Aucune région trouvée`);
            this._regions = regions;
        }
        return this._regions;
    }

    getRegionAtSecTime(secTime: SecTime): Region {
        return this.getRegionAtValue(secTime.value, "secTime");
    }

    getRegionAtBeatTime(beatTime: BeatTime): Region {
        return this.getRegionAtValue(beatTime.value, "beatTime");
    }

    private getRegionAtValue(value: number, field: WarpMarkerField): Region {
        return this.regions.find(region => value <= region.end[field]) ?? this.regions.at(-1)!;
    }

    /**
     * ATTENTION : pour que le calcul soit correct le Warp doit être fait comme si tout le sample était sur la même signature rythmique.
     * Sinon, il faut modifier chaque WarpMarker en adaptant la signature rythmique.
     * Cf. ConvertComponent
     */
    getSecTime(beatTime: BeatTime): SecTime | undefined {
        const region = this.getRegionAtBeatTime(beatTime);
        const secTimeValue = region.start.secTime + (beatTime.value - region.start.beatTime) / region.bps
        return new SecTime(secTimeValue);
    }

    getBeatTime(secTime: SecTime): BeatTime | undefined {
        const region = this.getRegionAtSecTime(secTime);
        const beatTimeValue = region.start.beatTime + (secTime.value - region.start.secTime) * region.bps
        return new BeatTime(beatTimeValue);
    }

}

class Region {
    constructor(
        readonly start: WarpMarker,
        readonly end: WarpMarker,
    ) {
    }

    get beatDuration(): number {
        return this.end.beatTime - this.start.beatTime
    }

    get secDuration(): number {
        return this.end.secTime - this.start.secTime
    }

    /**
     * @return Beats Per Second
     */
    get bps(): number {
        return this.beatDuration / this.secDuration
    }

}
