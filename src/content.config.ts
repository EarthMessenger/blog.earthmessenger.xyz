import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { SITE_LOCALES } from "./config";

const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.string(),
    lang: z.enum(SITE_LOCALES),
    opencc: z.boolean().optional(),
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
