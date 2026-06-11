import {unzip as fflateUnzip, Unzipped} from "fflate";
import {error} from "../utils";

// Source : https://stackoverflow.com/a/57331494/1655155
export function getAssetFile(filePath: string, fileName = filePath): Promise<File> {
    return new Promise((resolve, reject) => {
        const request = createAssetFileRequest(filePath);

        request.onload = () => {
            if (request.status !== 200) {
                reject(new Error(`Failed to load ${filePath}: ${request.status}`));
                return;
            }
            const file = new File([request.response], fileName, {type: 'application/zip'})
            resolve(file);
        };

        request.onerror = () => reject(new Error(`Network error loading ${filePath}`));
        request.send(null);
    });
}

/**
 * @param assetPath chemin relatif au dossier <code>assets</code>, sans séparateur en préfixe
 */
export function fetchAssetFile(assetPath: string): Promise<Response> {
    return fetch(`${document.baseURI}assets/${assetPath}`)
}

function createAssetFileRequest(filePath: string): XMLHttpRequest {
    const request = new XMLHttpRequest();
    request.open('GET', filePath, true);
    request.responseType = 'arraybuffer'; // maybe also 'text'
    return request;
}

// Source : https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
export async function unzip(blob: Blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    return await new Response(decompressedStream).blob();
}

export class Archive {
    constructor(
        private readonly unzipped: Unzipped,
    ) {

    }

    * [Symbol.iterator](): Generator<[string, Blob]> {
        for (const [path, data] of Object.entries(this.unzipped)) {
            yield [this.decodePath(path), newBlob(data)];
        }
    }

    protected decodePath(path: string): string {
        return path;
    }
}

// Table CP437 → Unicode pour les caractères > 0x7F
const CP437: Record<number, string> = {
    0x80: 'Ç', 0x81: 'ü', 0x82: 'é', 0x83: 'â', 0x84: 'ä', 0x85: 'à',
    0x86: 'å', 0x87: 'ç', 0x88: 'ê', 0x89: 'ë', 0x8A: 'è', 0x8B: 'ï',
    0x8C: 'î', 0x8D: 'ì', 0x8E: 'Ä', 0x8F: 'Å', 0x90: 'É', 0x91: 'æ',
    0x92: 'Æ', 0x93: 'ô', 0x94: 'ö', 0x95: 'ò', 0x96: 'û', 0x97: 'ù',
    0x98: 'ÿ', 0x99: 'Ö', 0x9A: 'Ü', 0x9B: '¢', 0x9C: '£', 0x9D: '¥',
    0x9E: '₧', 0x9F: 'ƒ', 0xA0: 'á', 0xA1: 'í', 0xA2: 'ó', 0xA3: 'ú',
    0xA4: 'ñ', 0xA5: 'Ñ', 0xA6: 'ª', 0xA7: 'º', 0xA8: '¿', 0xA9: '⌐',
    0xAA: '¬', 0xAB: '½', 0xAC: '¼', 0xAD: '¡', 0xAE: '«', 0xAF: '»',
};

export class Cp437Archive extends Archive {
    protected override decodePath(path: string): string {
        let decoded = "";
        for (let i = 0; i < path.length; i++) {
            const b = path.codePointAt(i);
            if (!b) error(`Caractère #${i} ${path} non défini !`);
            decoded += b < 0x80 ? String.fromCodePoint(b) : (CP437[b] ?? error(`Encodage CP437 inconnu pour ${b.toString(16)}`))
        }
        return decoded;
    }
}

export function newBlob(data: Uint8Array): Blob {
    return new Blob([data]);
}

function unzipAsync(uint8: Uint8Array): Promise<Unzipped> {
    return new Promise((resolve, reject) => {
        fflateUnzip(uint8, (err, unzipped) => {
            if (err) {
                reject(err);
            } else {
                resolve(unzipped);
            }
        })
    });
}

/**
 * Extrait une archive ZIP avec arborescence complète.
 * Pour itérer sur les entrées :
 *
 * ```typescript
 * const archive = await unzipArchive(zipFile);
 * for (const [fileName, archiveFile] of archive) {
 *   // ...
 * }
 * ```
 */
export async function unzipArchive(blob: Blob): Promise<Archive> {
    const buffer = await blob.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    const unzipped = await unzipAsync(uint8);

    return new Cp437Archive(unzipped);
}

export function getUploadedFile(event: Event): File | undefined {
    const fileList = getUploadedFiles(event);
    return fileList.length > 0 ? fileList[0] : undefined;
}

export function getUploadedFiles(event: Event): FileList {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList?.length) {
        return new FileList();
    }

    return fileList;
}

export function downloadJsonFile(filename: string, json: string): void {
    const blob = new Blob([json], {type: "text/json"});
    return downloadFile(filename, blob);
}

function downloadFile(filename: string, blob: Blob): void {
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export function basenameUnix(path: string, ext?: string) {
    const end = ext ? -ext.length : undefined;
    return path.slice(path.lastIndexOf('/') + 1, end);
}
