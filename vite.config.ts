import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
        alias: {
            'react': 'react',
            'react-dom': 'react-dom',
        },
    },
    build: {
        // Optimize chunk size to reduce memory usage
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    // Fixed chunks to ensure React is never duplicated
                    'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
                    'radix-vendor': [
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-navigation-menu',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-toggle-group',
                        '@radix-ui/react-tooltip',
                    ],
                    'inertia-vendor': ['@inertiajs/react'],
                },
            },
        },
        // Reduce concurrency to lower memory usage
        minify: 'esbuild',
        sourcemap: false,
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
    },
});
