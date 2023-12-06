import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: "G-SX2EH6Z0B5",
      },
    }),
  ],
});
