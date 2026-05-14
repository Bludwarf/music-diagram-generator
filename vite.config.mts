/// <reference types="vitest" />

import {defineConfig} from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({

    plugins: [angular(), viteTsConfigPaths()],

    test: {
        globals: true,

        environment: 'jsdom',

        setupFiles: ['src/test-setup.ts'],
        include: ['**/*.spec.ts'],
        reporters: ['default'],
        provide: {
            serverPort: 51223, // ton port fixe
        },
    },
    define: {
        'import.meta.vitest': mode !== 'production',
    },
    server: {
        port: 51223,
        fs: {allow: ['.']}
    }
}));
