// heavily inspired by:
// https://github.com/donnikitos/vite-plugin-html-inject/blob/6b2db212a75116bf546561dabb3410227d474a9a/src/index.ts

import { normalizePath } from "vite";
import path from "path";
import fs from "fs";

const tagMatcher = new RegExp('<load(?:.*?)src="([^"]+)"(.*?)/>', "gs");
const attrMatcher = new RegExp('(?:(?:s)?([a-z0-9_-]+)(?:="([^"]*)"|))', "gi");
const replaceAttrMatcher = new RegExp("{=[$]([a-z0-9_-]+)}", "gi");

/**
 *
 * @param {{ replace?: { undefined?: string }; debug?: { logPath?: boolean } }} [cfg] InjectHTMLConfig
 * @return {import("vite").Plugin}
 */
function injectHTML(cfg) {
  /**
   * @param {undefined | import("vite").ResolvedConfig} config
   */
  let config;

  /**
   * @param {string} code
   * @param {string} codePath
   * @return {Promise<string>}
   */
  async function renderSnippets(code, codePath) {
    if (!config) {
      return code;
    }

    const matches = code.matchAll(tagMatcher);

    for (const match of matches) {
      let [tag, url, attrs] = match;
      let root = config.root;

      if (url.startsWith(".")) {
        root = path.dirname(root + codePath);
      } else {
        url = "/" + url;
      }

      if (!(url.endsWith(".htm") || url.endsWith(".html"))) {
        ["html", "htm"].some((item) => {
          const filePath = normalizePath(path.join(root, url, `/index.${item}`));

          if (fs.existsSync(filePath)) {
            url += `/index.${item}`;

            return true;
          }
        });
      }

      const filePath = normalizePath(path.join(root, url));
      if (cfg?.debug?.logPath) {
        console.log("Trying to include ", filePath);
      }

      let out = tag;
      try {
        let data = fs.readFileSync(filePath, "utf8");

        for (const attr of attrs.matchAll(attrMatcher)) {
          data = data.replace(`{=$${attr[1]}}`, attr[2]);
        }
        data = data.replaceAll(replaceAttrMatcher, cfg?.replace?.undefined ?? "$&");

        out = await renderSnippets(data, url);
      } catch (error) {
        if (error instanceof Error) {
          out = error.message;
        }
        console.error(out);
      }

      code = code.replace(tag, out);
    }

    return code;
  }

  return {
    name: "static-html-loader",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml: {
      enforce: "pre",
      transform(html, ctx) {
        return renderSnippets(html, ctx.path);
      },
    },
  };
}

export default injectHTML;
