import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // https://www.freecodecamp.org/news/how-to-import-svgs-in-react-and-vite/
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
