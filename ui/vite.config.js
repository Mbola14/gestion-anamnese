import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",                // IMPORTANT pour que les assets marchent dans Zoho
  build: {
    outDir: "../app",        // on build directement dans le dossier widget
    emptyOutDir: false,      // IMPORTANT pour ne pas supprimer app/translations
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  }
});
