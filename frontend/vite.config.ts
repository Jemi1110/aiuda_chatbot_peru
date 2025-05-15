import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5174,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-toast', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip']
  }
}));
