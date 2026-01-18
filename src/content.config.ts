import { defineCollection, z } from "astro:content";

import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    readingTime: z.number(),
  }),
});


const now = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});



export const collections = { blog, now };
