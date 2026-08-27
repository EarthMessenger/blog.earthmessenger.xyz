import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { SITE_LOCALES } from './config';
import { createLangCollectionLoader, DEFAULT_LANG } from './lib/lang-loader';

const posts = defineCollection({
  loader: createLangCollectionLoader({
    name: 'posts-lang-loader',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.string(),
    lang: z.enum(SITE_LOCALES).default(DEFAULT_LANG),
    opencc: z.boolean().optional(),
  }),
});

const solution = defineCollection({
  loader: createLangCollectionLoader({
    name: 'solution-lang-loader',
    base: './src/content/oi-notes',
  }),
  schema: z.object({
    title: z.string(),
    tags: z.string(),
    lang: z.enum(SITE_LOCALES).default(DEFAULT_LANG),
    opencc: z.boolean().optional(),
  }),
});

export const collections = { posts, solution };
