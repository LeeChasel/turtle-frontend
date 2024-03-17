import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePluginRadar } from "vite-plugin-radar";

// TODO: Need more flexibility to switch between development and production
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      checker({ typescript: true }),
      tsconfigPaths(),
      mode === "production" &&
        VitePluginRadar({
          analytics: {
            id: "G-SX2EH6Z0B5",
          },
        }),
    ],
  };
});
