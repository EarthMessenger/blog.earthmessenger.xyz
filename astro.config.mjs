import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkJoinCjkLines from "remark-join-cjk-lines";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";

import gruvboxLight from "./src/shiki/gruvbox-light.json";
import gruvboxDark from "./src/shiki/gruvbox-dark.json";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: gruvboxLight,
        dark: gruvboxDark,
      },
    },
    remarkPlugins: [remarkMath, remarkToc, remarkJoinCjkLines],
    rehypePlugins: [
      [
        rehypeKatex, {
          macros: {
            "\\e": "\\mathrm{e}",
            "\\d": "\\mathrm{d}",
            "\\i": "\\mathrm{i}",
          },
        },
      ]
    ],
  },
  integrations: [sitemap()],
  site: "https://earthmessenger.xyz",
});
