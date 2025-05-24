import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
