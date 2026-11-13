import {AlsProject} from "./v10/als-project";
import {AudioTrack} from "./v10/audio-track";
import {AudioClip} from "./v10/audio-clip";
import {WarpMarker} from "../structure/warp-marker";
import {RecordingDto} from "../recording/recording-dto";
import {Structure} from "../structure/structure";
import {Section} from "../structure/section/section";
import {Part} from "../structure/part/part";
import {createRegionsFrom, groupByRegion, Region} from "../utils/region";
import {Locator} from "./v10/locator";
import {MidiClip} from "./v10/midi-clip";
import {BeatTime} from "../time";
import {Pattern} from "../structure/pattern/pattern";
import {PatternDto} from "../structure/structure-dto";
import {Chords} from "../notes";

export class AlsExtractor {

    private _midiEnd: BeatTime | undefined;

    constructor(private readonly alsProject: AlsProject) {

    }

    get originalAudioTrack(): AudioTrack {
        return this.alsProject.audioTracks[0]
    }

    get originalAudioClip(): AudioClip {
        return this.originalAudioTrack.audioClips[0]
    }

    get sampleDurationInSeconds(): number {
        const duration = this.originalAudioClip.duration
        const sampleRate = this.originalAudioClip.sampleRate
        return duration / sampleRate
    }

    get midiEnd(): BeatTime {
        if (this._midiEnd === undefined) {
            this._midiEnd = new BeatTime(
                this.alsProject.midiTracks
                    .reduce((sum, midiTrack) => Math.max(sum, midiTrack.end.value), 0),
            );
        }
        return this._midiEnd;
    }

    get warpMarkers(): WarpMarker[] {
        return this.originalAudioClip.wrapMarkers.map(wrapMarker => new WarpMarker(wrapMarker.secTime, wrapMarker.beatTime))
    }

    extractPatternDtoArray(): PatternDto[] {
        const structureMidiTrack = this.alsProject.findMidiTrack(/Structure/i) ?? this.alsProject.midiTracks[0];
        if (!structureMidiTrack) {
            console.warn(`Aucune piste midi contenant la structure n'a été trouvée dans le projet Live`);
        }
        const midiClips = structureMidiTrack ? structureMidiTrack.midiClips.sort((a, b) => a.currentStart.value - b.currentStart.value) : []

        return midiClips.map(midiClip => {
            const initial = Pattern.getInitialFromName(midiClip.name)
            const durationInBeats = midiClip.loopOn
                ? midiClip.loopEnd - midiClip.loopStart
                : midiClip.currentEnd.value - midiClip.currentStart.value;
            const durationInBars = durationInBeats / 4; // TODO calcul réel
            return {
                initial,
                name: midiClip.name,
                asciiChords: Chords.repeatNoChord(durationInBars).ascii.replaceAll(' ', '  '),
            }
        })
    }

    extractSections(): Section[] {
        return this.alsProject.locators
            .sort((a, b) => a.time.value - b.time.value)
            .map(locator => new Section(locator.name, []))
    }

    extractStructure(): Structure {

        const structureMidiTrack = this.alsProject.findMidiTrack(/Structure/i) ?? this.alsProject.midiTracks[0];
        if (!structureMidiTrack) {
            console.warn(`Aucune piste midi contenant la structure n'a été trouvée dans le projet Live`);
        }
        const structureMidiClips = structureMidiTrack ? structureMidiTrack.midiClips.sort((a, b) => a.currentStart.value - b.currentStart.value) : []

        const locatorAndSectionArray = this.alsProject.locators
            .sort((a, b) => a.time.value - b.time.value)
            .map(locator => {

                // TODO récup de toutes les clips qui sont dans la zone

                return ({
                    locator,
                    section: new Section(locator.name, []),
                });
            })

        if (!structureMidiTrack) {
            console.warn(`Aucune piste midi contenant la structure n'a été trouvée dans le projet Live`);
        } else if (locatorAndSectionArray.length) {

            const patterns = this.extractPatternDtoArray();

            const midiEnd = this.midiEnd;
            const regions = createRegionsFrom(locatorAndSectionArray, LocatorAndSectionRegion, midiEnd, false);
            const midiClipsRegions = createRegionsFrom(structureMidiClips, MidiClipRegion, midiEnd, false)
            const midiClipsByRegion = groupByRegion(midiClipsRegions, regions);

            const patternRepository: Map<string, Pattern> = new Map();

            // for (const [region, midiClipsRegions] of midiClipsByRegion) {
            //     for (const midiClipRegion of midiClipsRegions) {
            //         const midiClip = midiClipRegion.item;
            //         const durationInBars = (midiClip.currentEnd.value - midiClip.currentStart.value) / 4; // TODO récup calculs signature
            //
            //         const patternName = midiClip.name;
            //         if (!patternRepository.has(patternName)) {
            //             // TODO faire une vérification plus précise du mapping entre MidiClip et Pattern
            //             const initial = midiClip.name; // TODO
            //             patternRepository.set(patternName, new Pattern(midiClip.name, durationInBars, initial))
            //         }
            //         const pattern = patternRepository.get(patternName)!;
            //
            //         region.section.patterns.push(pattern);
            //     }
            // }
        }

        return Structure.builder()
            .parts([new Part('1', locatorAndSectionArray.map(las => las.section))]) // TODO créer une nouvelle partie à chaque fin de refrain
            .build();
    }

    extractRecordingDto(): RecordingDto {
        return {
            name: this.originalAudioClip.name,
            sampleDurationInSeconds: this.sampleDurationInSeconds,
            warpMarkers: this.warpMarkers,
        }
    }

}

interface LocatorAndSection {
    locator: Locator;
    section: Section;
}

class LocatorAndSectionRegion extends Region<LocatorAndSection> {

    override getTime(las: LocatorAndSection): BeatTime {
        return las.locator.time;
    }

    get section(): Section {
        return this.item.section;
    }

}

class MidiClipRegion extends Region<MidiClip> {

    override getTime(midiClip: MidiClip): BeatTime {
        return midiClip.currentStart;
    }

}
