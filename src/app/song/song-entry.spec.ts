import {Structure} from "../structure/structure";
import {SongEntry} from "./song-entry";
import {Part} from "../structure/part/part";
import {Section} from "../structure/section/section";
import {Pattern} from "../structure/pattern/pattern";

export const DEFAULT_SONG_ENTRY: SongEntry = {
    name: "Morceau de test",
    structure: new Structure([
        new Part("1", [
            new Section("Intro", [
                new Pattern("Intro", 1, "I"),
            ])
        ])
    ]),
}
