// https://docs.astro.build/en/tutorials/add-content-collections/

import { z, defineCollection } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      tags: z.string(), // Currently, the tags need to be split manually, and I'm lazy to change it.
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
