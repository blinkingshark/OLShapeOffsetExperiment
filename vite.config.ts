import { defineConfig } from 'vite';

export default defineConfig({

    root: "./src",

    // Configure the build output directory
    build: {
        outDir: '.././dist',
    },

    // Configure the development server
    server: {
        // Change the port if needed
        port: 3000,
    },

    // Enable TypeScript support
    // Make sure to install the necessary dependencies
    // (e.g. "npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser")
    // if you're using TypeScript
    resolve: {
        alias: {
            '@': '/src',
        },
        extensions: ['.js', '.ts'],
    },
});