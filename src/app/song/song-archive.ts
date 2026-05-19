import {ArchiveFile, basenameUnix, unzipArchive} from "../utils/file-utils";
import {Recording} from "../recording/recording";
import {error, getOrRequire} from "../utils";
import {StructureDto} from "../structure/structure-dto";

export const STRUCTURE_JSON = "structure.json";
export const RECORDING_JSON = "recording.json";
const RECORDING_MP3 = "recording.mp3";
const SONG_ARCHIVE_FILE_NAMES = [
    STRUCTURE_JSON,
    RECORDING_JSON,
] as readonly string[];
export type SongArchiveFileName = typeof SONG_ARCHIVE_FILE_NAMES[number];

const SETLIST_TXT = "setlist.txt";

export class SongArchive {

    constructor(
        readonly title: string,
        private readonly versionBySongCode: Record<string, string | undefined>,
        private readonly filesBySongCode: Record<string, Record<SongArchiveFileName, ArchiveFile>>,
        readonly setlist: readonly string[],
    ) {
    }

    static async fromZip(zip: File): Promise<SongArchive> {
        const archive = await unzipArchive(zip);
        const versionBySongCode: Record<string, string | undefined> = {};
        const filesBySongCode: Record<string, Record<SongArchiveFileName, ArchiveFile>> = {};
        let songNames: Set<string> = new Set();
        let setlist: string[] | undefined = undefined;
        for (const [fileName, archiveFile] of archive) {
            if (fileName === SETLIST_TXT) {
                setlist = await this.parseSetlistFile(archiveFile);
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

            if (songCode in versionBySongCode && versionBySongCode[songCode] !== version) error(`On ne peut pas mélanger les versions dans le dossier du morceau ${songName}`);
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

    private static async parseSetlistFile(archiveFile: ArchiveFile): Promise<string[]> {
        const text = await archiveFile.text()
        return text
            .trim()
            .split(/\r?\n/)
            .map(songNameInSetlist => SongInArchive.resolveSongNameFromSetlist(songNameInSetlist))
            ;
    }

    * [Symbol.iterator](): Iterator<SongInArchive> {
        const uniqueSongNames = [...new Set(this.setlist)]
        for (const songName of uniqueSongNames) {
            const song = this.getSong(songName);
            if (song) { // On autorise les morceaux inconnus dans la playlist
                yield song;
            }
        }
    }

    song(songName: string): SongInArchive {
        return this.requireSong(songName);
    }

    private requireSong(songName: string): SongInArchive {
        const song = this.getSong(songName, true);
        if (!song) error(`Morceau "${songName}" introuvable dans l'archive !`)
        return song;
    }

    private getSong(songName: string, required = false): SongInArchive | undefined {
        const songCode = SongInArchive.songCode(songName);
        getOrRequire(songCode in this.filesBySongCode, required, () => `Morceau "${songName}" introuvable dans l'archive !`);

        const songFiles = getOrRequire(this.filesBySongCode[songCode], required, () => `Aucun fichiers trouvés dans l'archive pour le morceau ${songName}`);
        if (!songFiles) return undefined;

        return new SongInArchive(songName, this.versionBySongCode[songCode], songFiles);
    }

}

export class SongInArchive {
    constructor(
        /** Le nom du morceau tel qu'il apparaît dans la setlist ou dans son dossier */
        public readonly name: string,
        public readonly version: string | undefined,
        private readonly songFiles: Record<string, ArchiveFile>) {
    }

    // TODO cache
    get recording(): Promise<Recording | undefined> {
        return this.getDto<Recording>(RECORDING_JSON);
    }

    // TODO cache
    get structure(): Promise<StructureDto> {
        return this.requireDto<StructureDto>(STRUCTURE_JSON);
    }

    get audio(): Promise<Blob | undefined> {
        return this.getArrayBuffer(RECORDING_MP3);
    }

    private async requireDto<T>(fileName: SongArchiveFileName): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.getDto<T>(fileName)
                .then(dto => {
                    if (dto) {
                        resolve(dto)
                    } else {
                        reject(new Error(`${fileName} requis introuvable dans l'archive`));
                    }
                })
        });
    }

    private async getDto<T>(fileName: SongArchiveFileName): Promise<T | undefined> {
        const file = this.getArchiveFile(fileName);
        const json = await file?.text();
        if (!json) return undefined;
        return JSON.parse(json) as T
    }

    private async getArrayBuffer(fileName: SongArchiveFileName): Promise<Blob | undefined> {
        const file = this.getArchiveFile(fileName);
        if (!file) return undefined;
        return new Blob([await file.arrayBuffer()]);
    }

    private getArchiveFile(fileName: SongArchiveFileName): ArchiveFile | undefined {
        return this.songFiles[fileName];
    }

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

const LE_PHARE = SongInArchive.songCode("Le phare");
