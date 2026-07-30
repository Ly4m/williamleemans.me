# williamleemans.me

Personal site and French-language tech blog for William Leemans — part professional calling card, part creative playground, part personal "Now" hub. Production: **https://lmns.fr**

Built with [Astro](https://astro.build) + [Svelte](https://svelte.dev) (interactive bits), styled with [Tailwind CSS 4](https://tailwindcss.com), deployed to Netlify.

## Development

```sh
pnpm install     # install dependencies
pnpm dev         # dev server at http://localhost:4321
pnpm build       # production build to ./dist/
pnpm preview     # preview the production build locally
```

No test/lint commands; formatting is handled by Prettier (`.prettierrc`, with the Astro and Tailwind plugins).

## Project shape

- **Content** lives in `src/content/` as Astro Content Collections (`blog/`, `now/`), validated by Zod schemas in `src/content.config.ts`.
- **Blog posts** route by their `slug` frontmatter field (e.g. `/blog/flux-rss`).
- **Two layouts** by design: `BlogLayout` (Home, Blog, posts) and `Layout` (Now pages).
