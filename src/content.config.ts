import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

/**
 * `z.coerce.date()` avale `"2025-11-6"` sans broncher — et `Date` traite une
 * chaîne hors forme ISO comme minuit *local*, pas minuit UTC. Un jour entier
 * de décalage sur la page, dans le flux et dans le sitemap, avec un build vert
 * de bout en bout : c'est exactement ce qui est arrivé à `ember-animation.md`,
 * et rien ne l'a vu (issue #20).
 *
 * D'où la forme stricte. Une date YAML non quotée arrive ici en `Date` déjà
 * construite — YAML l'a parsée, elle est bonne — et passe telle quelle ; c'est
 * la chaîne quotée, la forme que ce dépôt utilise partout, qui doit être
 * zéro-padée.
 *
 * C'est le versant BLOQUANT du garde-fou : ceci casse `pnpm build`, y compris
 * en `pnpm dev`, donc une donnée malformée n'atteint jamais `dist/`. Le
 * versant informatif vit dans `scripts/guard.mjs`.
 */
const dateStricte = z
  .union([
    z.date(),
    z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "doit s'écrire AAAA-MM-JJ, zéros compris (sinon la date est lue en heure locale et glisse d'un jour)",
      ),
  ])
  // Le `Z` est ce qui épingle la date sur minuit UTC, quelle que soit la zone
  // de la machine qui construit.
  .transform((v) => (v instanceof Date ? v : new Date(`${v}T00:00:00Z`)));

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    pubDate: dateStricte,
    dateModified: dateStricte.optional(),
    readingTime: z.number(),
    ogImage: z.string().optional(),
    /* Le sommaire est une DÉCISION par article, pas une conséquence du nombre
       de titres. Un seuil sur le compte serait une approximation de « cet
       article est une surface de consultation », et une mauvaise :
       `ember-animation` porte huit titres en 5,7 ko et se lit d'un trait, où
       `garder-un-historique-git-propre` n'a que deux h2 mais quatre h3 qui
       sont exactement ce qu'on vient rechercher. Par défaut absent : un
       sommaire est un appareil, et un appareil se demande. */
    toc: z.boolean().optional().default(false),
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

const albumSchema = z.object({
  title: z.string(),
  artist: z.string(),
  note: z.string().optional(),
  status: z.enum(["découverte", "en-boucle"]),
  url: z.string().url(),
});

const now = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    pubDate: dateStricte,
    lang: z.string().optional(),
    booksIntro: z.string().optional(),
    books: z.array(bookSchema).optional(),
    gamesIntro: z.string().optional(),
    games: z.array(gameSchema).optional(),
    musicIntro: z.string().optional(),
    music: z.array(albumSchema).optional(),
  }),
});

export const collections = { blog, now };
