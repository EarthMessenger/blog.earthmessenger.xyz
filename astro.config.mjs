import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeMathJaxSvg from "rehype-mathjax";
import remarkJoinCjkLines from "remark-join-cjk-lines";
import sitemap from "@astrojs/sitemap";

import gruvboxLight from "./src/shiki/gruvbox-light.json";
import gruvboxDark from "./src/shiki/gruvbox-dark.json";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: gruvboxLight,
        dark: gruvboxDark
      }
    },
    remarkPlugins: [remarkMath, remarkJoinCjkLines],
    rehypePlugins: [rehypeMathJaxSvg]
  },
  integrations: [sitemap()],
  site: "https://earthmessenger.xyz"
});
