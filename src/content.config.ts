import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE_LANG } from "./config";

const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.string(), // Currently, the tags need to be split manually, and I'm lazy to change it.
    lang: z.string().default(SITE_LANG),
  }),
});

const solution = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/oi-notes",
  }),
  schema: z.object({
    title: z.string(),
    tags: z.string(),
  }),
})

export const collections = { posts, solution };
