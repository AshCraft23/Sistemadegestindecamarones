import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },

  server: {
    host: true,
    port: 3000,
    open: false,
  },

  preview: {
    host: true,
    port: 8080,
    allowedHosts: ["*", ".railway.app"],
  },

  optimizeDeps: {
    include: ["@supabase/supabase-js"],
  },

  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      external: [],
    }
  }
});
