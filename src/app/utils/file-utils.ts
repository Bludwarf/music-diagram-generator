import unz, {Archive, ArchiveFile} from "unz";
import {error} from "../utils";

export type UnzippedEntry = {
    path: string;
    isDir: boolean;
    blob: string | null;
};

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

export function requireUploadedFiles<T extends string>(event: Event, REQUIRED_FILES_NAMES: readonly T[]) {
    const uploadedFiles = getUploadedFiles(event);

    type RequiredFilesKey = typeof REQUIRED_FILES_NAMES[number];
    const requiredFiles: Partial<Record<RequiredFilesKey, File>> = {}
    for (const uploadedFile of uploadedFiles) {
        for (const requiredFileName of REQUIRED_FILES_NAMES) {
            if (uploadedFile.name === requiredFileName) {
                requiredFiles[requiredFileName] = uploadedFile;
            }
        }
    }

    for (const requiredFileName of REQUIRED_FILES_NAMES) {
        if (!(requiredFileName in requiredFiles)) {
            throw new Error(`Fichier ${requiredFileName} manquant !`);
        }
    }

    return requiredFiles as Record<RequiredFilesKey, File>;
}

export function downloadJsonFile(filename: string, json: string): void {
    const blob = new Blob([json], {type: "text/json"});
    return downloadFile(filename, blob);
}

function downloadFile(filename: string, blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Extrait un fichier compressé simple (gzip, deflate…) — inchangée
 * @see Source : https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
 */
export async function unzip(blob: Blob, format: CompressionFormat = "gzip") {
    const ds = new DecompressionStream(format);
    const decompressedStream = blob.stream().pipeThrough(ds);
    const uncompressed = await new Response(decompressedStream).blob();
    console.log('uncompressed', uncompressed);
    return uncompressed;
}

/**
 * Extrait une archive ZIP avec arborescence complète via `unz`.
 * Pour itérer sur les entrées :
 *
 * ```typescript
 * const archive = await unzipArchive(zipFile);
 * for (const [fileName, archiveFile] of archive) {
 *   // ...
 * }
 * ```
 */
export async function unzipArchive(blob: Blob): Promise<ArchivePathEncodingFixWrapper> {
    const buffer = await blob.arrayBuffer();
    const archive = unz(buffer);
    return new ArchivePathEncodingFixWrapper(archive); // TODO problème d'encodage (exemple : "é" -> "\uFFFD")
}

export class ArchivePathEncodingFixWrapper {


    constructor(
        public readonly archive: Archive,
    ) {
    }

    *[Symbol.iterator](): MapIterator<[string, ArchiveFile]> {
        for (const [fileName, archiveFile] of this.archive) {
            yield [this.decodeFileName(fileName), archiveFile];
        }
    }

    private decodeFileName(fileName: string): string {
        if (!fileName.includes("\uFFFD")) return fileName;

        const decodedFileName = fileName
            .replace("r\uFFFDve", "rêve")
            .replace(" \uFFFD ", " à ")
            .replace("r\uFFFDsist", "résist")
            .replace("Broc\uFFFDliande", "Brocéliande")
        ;

        if (decodedFileName.includes("\uFFFD")) error(`Décodage incomplet pour le nom de fichier : ${fileName} -> ${decodedFileName}`);

        return decodedFileName;
    }
}

/**
 * Extrait une archive ZIP avec arborescence complète via `unz`.
 */
export async function unzipArchiveEntries(blob: Blob): Promise<UnzippedEntry[]> {
    const buffer = await blob.arrayBuffer();
    const archive = unz(buffer); // retourne une Map<string, ArchiveFile>

    const entries: UnzippedEntry[] = [];
    for (const [fileName, archiveFile] of archive) {
        const isDir = fileName.endsWith('/');
        entries.push({
            path: fileName,
            isDir,
            blob: isDir ? null : await archiveFile.text(),
        });
    }
    return entries;
}
