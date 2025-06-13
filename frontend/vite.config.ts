<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
>>>>>>> Stashed changes
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
>>>>>>> Stashed changes
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
}));
=======
=======
>>>>>>> Stashed changes
  server: {
    port: 3000,
    open: true,
  },
});
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
