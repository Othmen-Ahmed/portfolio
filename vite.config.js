import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the build work under https://othmen-ahmed.github.io/portfolio/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { assetsDir: "static" }, // keep Vite files apart from public/assets
});
