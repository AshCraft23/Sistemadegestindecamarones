import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 🚀 CONFIGURACIÓN PARA RAILWAY
  server: {
    host: true,
    port: 3000,
    open: false, // evita el error xdg-open ENOENT
  },

  preview: {
    host: true,
    port: 8080, // Railway asigna este puerto internamente
    allowedHosts: [
      "*",
      ".railway.app",
      "sistemadegestindecamarones-production-d8d5.up.railway.app"
    ],
  },

  // 🚀 FIX: asegura que Supabase NO falle en el build
  optimizeDeps: {
    include: ["@supabase/supabase-js"],
  },

  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      external: [], // evita el error de módulo no resuelto
    },
  },
});
