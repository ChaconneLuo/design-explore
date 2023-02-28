import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import UnoCss from 'unocss/vite';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  plugins: [
    react(),
    UnoCss(),
    Pages({
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/canvas/', baseRoute: '' },
      ],
      exclude: ['src/cannvas/assets', 'src/cannvas/**/*'],
    }),
  ],
});
