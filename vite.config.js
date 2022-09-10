import { dirname, join } from "path";
import { fileURLToPath } from "url";
import injectHTML from "./vite-plugin-html-inject";

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import("vite").UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  build: {
    rollupOptions: {
      input: {
        index: join(PACKAGE_ROOT, "index.html"),
        template: join(PACKAGE_ROOT, "template/index.html"),
        iacToolsInAws: join(PACKAGE_ROOT, "iac-tools-in-aws/index.html"),
      },
    },
  },
  plugins: [injectHTML()],
};

export default config;
