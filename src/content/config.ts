// https://docs.astro.build/en/tutorials/add-content-collections/

import { z, defineCollection } from "astro:content";
import { SITE_LANG } from "../config";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      tags: z.string(), // Currently, the tags need to be split manually, and I'm lazy to change it.
      lang: z.string().default(SITE_LANG),
    })
  }),
  "oi-notes": defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      tags: z.string(),
    })
  }),
};
