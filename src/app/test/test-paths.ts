export const TEST_PATHS = [
    'chords-grid',
    'structure-list',
    'create-zip',
    'setlist-structure-page',
] as const;

export const TEST_PATHS_MAP: Record<string, string> = {}
for (const testPath of TEST_PATHS) {
    TEST_PATHS_MAP[testPath] = testPath;
}
