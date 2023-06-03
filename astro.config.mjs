import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeMathJaxSvg from "rehype-mathjax";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "css-variables"
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJaxSvg]
  },
  integrations: [sitemap()],
  site: "https://blog.earthmessenger.xyz"
});