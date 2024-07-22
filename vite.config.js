import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Spritesmith from 'vite-plugin-spritesmith';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://lbm-assets.vercel.app',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    Spritesmith({
      watch: false,
      src: {
        cwd: './src/sprites',
        glob: '*.png',
      },
      target: {
        image: './public/sprite.png',
        css: [
          [
            './src/assets/_sprite.scss',
            {
              format: 'handlebars_based_template',
            },
          ],
          [
            './src/data/sprite.json',
            {
              format: 'json_array',
            },
          ],
        ],
      },
      apiOptions: {
        cssImageRef: '/sprite.png',
        spritesheet_info: {
          name: 'spritesmith',
          format: 'handlebars_based_template',
        },
      },
      customTemplates: {
        handlebars_based_template: './src/scss.handlebars',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
