import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // 💥 Minify KAPALI
    target: "esnext", // ESM uyumlu
  },
  ssr: {
    noExternal: ["kaboom"], // Kaboom optimize edilmesin
  },
});
