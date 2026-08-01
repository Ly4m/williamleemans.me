// @ts-check
import { readdirSync, readFileSync } from "node:fs";

import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import svelte from "@astrojs/svelte";

const SITE = "https://lmns.fr";

/**
 * Extract a flat key/value map from a markdown frontmatter block.
 * @param {string} raw
 */
function readFrontmatter(raw) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return {};
  /** @type {Record<string, string>} */
  const fields = {};
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fields[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

/**
 * Normalize a `YYYY-M-D` date to a UTC-midnight ISO string, matching Zod's coercion.
 * @param {string} value
 */
function toIso(value) {
  const [y, m, d] = value.split("-").map(Number);
  if ([y, m, d].every((n) => Number.isInteger(n))) {
    return new Date(Date.UTC(y, m - 1, d)).toISOString();
  }
  return new Date(value).toISOString();
}

/**
 * Build a `full URL -> lastmod ISO` map from a content collection directory.
 * @param {string} dir Directory to scan, relative to this file.
 * @param {string} urlPrefix Route prefix the slugs hang off, e.g. `/blog/`.
 */
function collectLastmod(dir, urlPrefix) {
  const base = new URL(dir, import.meta.url);
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const file of readdirSync(base)) {
    if (!file.endsWith(".md")) continue;
    const fm = readFrontmatter(readFileSync(new URL(file, base), "utf8"));
    const date = fm.dateModified ?? fm.pubDate;
    if (!fm.slug || !date) continue;
    map.set(`${SITE}${urlPrefix}${fm.slug}/`, toIso(date));
  }
  return map;
}

const lastmod = new Map([
  ...collectLastmod("./src/content/blog/", "/blog/"),
  ...collectLastmod("./src/content/now/", "/now/"),
]);

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      serialize(item) {
        const date = lastmod.get(item.url);
        if (date) item.lastmod = date;
        return item;
      },
    }),
    svelte(),
  ],
  /*
   * Markdown images were being requested at their intrinsic size — the desktop
   * screenshot went out at 3600px wide into a 62ch column. `constrained` gives
   * every image a srcset capped at its natural width, so the browser asks the
   * Netlify Image CDN for the size it will actually paint.
   */
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});
