import {basenameUnix, unzipArchive} from "../utils/file-utils";
import {Recording} from "../recording/recording";
import {error, getOrRequire} from "../utils";
import {StructureDto} from "../structure/structure-dto";
import {Midi} from "../midi";

export const STRUCTURE_JSON = "structure.json";
export const RECORDING_JSON = "recording.json";

const AUDIO_EXTENSION = ".mp3";
const RECORDING_MP3 = "recording" + AUDIO_EXTENSION;

const MIDI_EXTENSION = ".mid.json"; // TODO accepter directement du *.mid
const STRUCTURE_MIDI = "structure" + MIDI_EXTENSION;

const MUSIC_XML_EXTENSION = ".mxl.xml"; // TODO accepter directement du *.mxl (XML zippé)
const MUSIC_XML = "structure" + MUSIC_XML_EXTENSION;

const SONG_FILE_NAMES = [
    STRUCTURE_JSON,
    RECORDING_JSON,
    RECORDING_MP3,
    STRUCTURE_MIDI,
] as readonly string[];

export type SongFileName = typeof SONG_FILE_NAMES[number];

const SETLIST_TXT = "setlist.txt";

export abstract class SongFileSystem<T extends SongInFileSystem> {

    protected constructor(
        readonly nameForErrorMessage: string,
        readonly title: string,
        protected readonly versionBySongCode: Record<string, string | undefined>,
        protected readonly filesBySongCode: Record<string, Record<SongFileName, Blob>>,
        readonly setlist: readonly string[],
    ) {
    }

    static async parseSetlistFile(file: Blob): Promise<string[]> {
        const text = await file.text()
        return text
            .trim()
            .split(/\r?\n/)
            .map(songNameInSetlist => SongInArchive.resolveSongNameFromSetlist(songNameInSetlist))
            ;
    }

    * [Symbol.iterator](): Iterator<T> {
        const uniqueSongNames = [...new Set(this.setlist)]
        for (const songName of uniqueSongNames) {
            const song = this.getSong(songName, false);
            if (song) { // On autorise les morceaux inconnus dans la playlist
                yield song;
            }
        }
    }

    song(songName: string): T {
        return this.requireSong(songName);
    }

    private requireSong(songName: string): T {
        const song = this.getSong(songName, true);
        if (!song) error(`Morceau "${songName}" introuvable ${this.nameForErrorMessage} !`)
        return song;
    }

    protected abstract getSong(songName: string, required: boolean): T | undefined;
}

export class SongArchive extends SongFileSystem<SongInArchive> {

    constructor(
        title: string,
        versionBySongCode: Record<string, string | undefined>,
        filesBySongCode: Record<string, Record<SongFileName, Blob>>,
        setlist: readonly string[],
    ) {
        super(`dans l'archive`, title, versionBySongCode, filesBySongCode, setlist);
    }

    static async fromZip(zip: File): Promise<SongArchive> {
        const archive = await unzipArchive(zip);
        const versionBySongCode: Record<string, string | undefined> = {};
        const filesBySongCode: Record<string, Record<SongFileName, Blob>> = {};
        let songNames: Set<string> = new Set();
        let setlist: string[] | undefined = undefined;
        for (const [fileName, archiveFile] of archive) {
            if (fileName === SETLIST_TXT) {
                setlist = await this.parseSetlistFile(archiveFile);
                continue;
            }

            if (fileName.endsWith("/")) {
                // On ignore les dossiers
                continue;
            }

            const indexOfSlash = fileName.indexOf("/");
            if (indexOfSlash === -1) {
                console.warn(`Fichier ignoré dans l'archive : ${fileName}`);
                continue;
            }

            const songName = decodeURIComponent(fileName.substring(0, indexOfSlash));
            songNames.add(songName);
            const songCode = SongInArchive.songCode(songName);

            const pathAfterSongName = fileName.substring(indexOfSlash + 1);
            const indexOfSlash2 = pathAfterSongName.indexOf("/");
            const version = indexOfSlash2 === -1 ? undefined : decodeURIComponent(pathAfterSongName.substring(0, indexOfSlash2));

            if (songCode in versionBySongCode && versionBySongCode[songCode] !== version) error(`On ne peut pas mélanger les versions ${versionBySongCode[songCode]} et ${version} dans le dossier du morceau ${songName}`);
            versionBySongCode[songCode] = version;

            const songFileName = (version ? pathAfterSongName : fileName).substring((version ? indexOfSlash2 : indexOfSlash) + 1);
            if (songFileName) {
                if (!(songCode in filesBySongCode)) filesBySongCode[songCode] = {};
                const songFiles = filesBySongCode[songCode];
                songFiles[songFileName] = archiveFile;
            }
        }

        const title = decodeURIComponent(basenameUnix(zip.name, ".zip"));
        return new SongArchive(title, versionBySongCode, filesBySongCode, setlist ?? [...songNames]);
    }

    protected override getSong(songName: string, required = false): SongInArchive | undefined {
        const songCode = SongInArchive.songCode(songName);
        getOrRequire(songCode in this.filesBySongCode, required, () => `Morceau "${songName}" introuvable dans l'archive !`);

        const songFiles = getOrRequire(this.filesBySongCode[songCode], required, () => `Aucun fichiers trouvés dans l'archive pour le morceau ${songName}`);
        if (!songFiles) return undefined;

        return new SongInArchive(this, songName, this.versionBySongCode[songCode], songFiles);
    }
}

export abstract class SongInFileSystem {
    protected constructor(
        public readonly songFileSystem: SongFileSystem<SongInFileSystem>,
        /** Le nom du morceau tel qu'il apparaît dans la setlist ou dans son dossier */
        public readonly name: string,
        public readonly version: string | undefined,
    ) {
    }

    // TODO cache
    get recording(): Promise<Recording | undefined> {
        return this.getDto<Recording>(RECORDING_JSON);
    }

    // TODO cache
    get midi(): Promise<Midi | undefined> {
        return this.getDto<Midi>(STRUCTURE_MIDI, MIDI_EXTENSION);
    }

    // TODO cache
    get musicXml(): Promise<string | undefined> {
        return this.getText(MUSIC_XML, MUSIC_XML_EXTENSION);
    }

    // TODO cache
    get structure(): Promise<StructureDto> {
        return this.requireDto<StructureDto>(STRUCTURE_JSON);
    }

    get audio(): Promise<Blob | undefined> {
        return this.getArrayBuffer(RECORDING_MP3, AUDIO_EXTENSION);
    }

    private async requireDto<T>(fileName: SongFileName): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.getDto<T>(fileName)
                .then(dto => {
                    if (dto) {
                        resolve(dto)
                    } else {
                        reject(new Error(`${fileName} requis introuvable ${this.songFileSystem.nameForErrorMessage}`));
                    }
                })
        });
    }

    private async getDto<T>(fileName: SongFileName, extension?: string): Promise<T | undefined> {
        const json = await this.getText(fileName, extension);
        if (!json) return undefined;
        return JSON.parse(json) as T
    }

    private async getText(fileName: SongFileName, extension?: string): Promise<string | undefined> {
        const file = await this.getFile(fileName, extension)
        return file?.text();
    }

    private async getArrayBuffer(fileName: SongFileName, extension?: string): Promise<Blob | undefined> {
        const file = await this.getFile(fileName, extension)
        if (!file) return undefined;
        return new Blob([await file.arrayBuffer()]);
    }

    protected abstract getFile(fileName: SongFileName, extension?: string): Promise<Blob | undefined>;

    static songCode(songName: string): string {
        return songName.trim()
            .toLocaleLowerCase()
            .replaceAll(/\W/g, '');
    }

    /**
     * Gestion temporaire des alias TODO Les alias de nom de morceau ne sont pas encore bien gérés depuis #52
     */
    static resolveSongNameFromSetlist(songNameFromSetlist: string): string {
        const songCode = SongInArchive.songCode(songNameFromSetlist);
        if (songCode === LE_PHARE) {
            return "Le jour (le phare)";
        }
        return songNameFromSetlist;
    }

}

export class SongInArchive extends SongInFileSystem {
    constructor(
        archive: SongArchive,
        name: string,
        version: string | undefined,
        private readonly songFiles: Record<string, Blob>,
    ) {
        super(archive, name, version);
    }

    protected async getFile(fileName: SongFileName, extension?: string): Promise<Blob | undefined> {
        return this.songFiles[fileName] ??
            (extension ? this.searchArchiveFileByExtension(extension) : undefined)
    }

    private searchArchiveFileByExtension(extension: string): Blob | undefined {
        for (const fileName in this.songFiles) {
            if (fileName.endsWith(extension)) return this.songFiles[fileName];
        }
        return undefined;
    }
}

const LE_PHARE = SongInArchive.songCode("Le phare");
