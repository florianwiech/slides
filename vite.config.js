import { dirname, join } from "path";
import { fileURLToPath } from "url";

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import("vite").UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  build: {
    rollupOptions: {
      input: {},
    },
  },
};

export default config;
