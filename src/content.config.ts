import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    readingTime: z.number(),
    ogImage: z.string().optional(),
    related: z.array(z.string()).max(2).optional(),
    howTo: z
      .object({
        name: z.string(),
        steps: z.array(z.object({ name: z.string(), text: z.string() })).min(2),
      })
      .optional(),
  }),
});

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  note: z.string().optional(),
  status: z.enum(["lu", "en-cours"]),
  coverUrl: z.string().optional(),
});

const gameSchema = z.object({
  title: z.string(),
  note: z.string().optional(),
  status: z.enum(["terminé", "en-cours"]),
});

const now = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    pubDate: z.coerce.date(),
    lang: z.string().optional(),
    booksIntro: z.string().optional(),
    books: z.array(bookSchema).optional(),
    gamesIntro: z.string().optional(),
    games: z.array(gameSchema).optional(),
  }),
});

export const collections = { blog, now };
