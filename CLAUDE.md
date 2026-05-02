# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm preview    # Preview production build locally
```

No test or lint commands are configured; code quality is managed via Prettier (`.prettierrc` with astro and tailwindcss plugins).

## Architecture

Personal portfolio/blog site built with **Astro 6** + **Svelte 5** (for interactive components), styled with **Tailwind CSS 4**, deployed to Netlify.

### Content Layer

Astro Content Collections (`src/content/`) with Zod schema validation in [`src/content.config.ts`](src/content.config.ts):

- **`blog/`** — Markdown posts. Schema: `slug`, `title`, `description`, `pubDate`, `readingTime`. Images live in `blog/images/`.
- **`now/`** — "Now" page entries (nownownow.com style). Schema: `slug`, `title`, `pubDate`.

Static paths are generated at build time; the RSS feed at `src/pages/rss.xml.js` pulls from the blog collection.

### Routing

| Path | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/blog` | `src/pages/blog.astro` |
| `/blog/[id]` | `src/pages/blog/[id].astro` |
| `/now` | `src/pages/now/index.astro` |
| `/now/[id]` | `src/pages/now/[id].astro` |
| `/rss.xml` | `src/pages/rss.xml.js` |

### Key Components

- **`EmberBackground.svelte`** — Canvas particle animation (ember/wisp effect). Uses simplex-noise for natural movement; adapts colors to dark/light theme via `MutationObserver` watching `document.documentElement.classList`. The underlying logic lives in `src/lib/ParticleSystem.ts`.
- **`SideNav.astro`** — Fixed left sidebar on desktop; full-screen overlay on mobile with hamburger toggle and theme toggle.
- **`Layout.astro`** — Master layout; inlines a theme-init script to prevent flash of unstyled theme (reads `localStorage`).

### Styling Conventions

- Tailwind CSS 4 (Vite plugin, not PostCSS). Config is in `astro.config.mjs`.
- Custom CSS variables defined in `src/styles/global.css` (`--color-primary-100`, `--color-charcoal`, `--color-faded`).
- `@tailwindcss/typography` for blog post prose; `@iconify/tailwind4` with tabler icons for icons.
- Dark mode toggled by adding/removing the `dark` class on `<html>`, persisted in `localStorage`.
- Custom animations: `wave-enter` (staggered children), `slide-down`, `name-expand`.

### Fonts

- `@fontsource/space-grotesk` — headings
- `@fontsource/ibm-plex-mono` — body and code

### Markdown / Syntax Highlighting

Shiki with dual themes: `vitesse-light` (light mode) and `github-dark` (dark mode), configured in `astro.config.mjs`.

### Site Config

- Production URL: `https://lmns.fr` (set in `astro.config.mjs`)
- Netlify adapter (`@astrojs/netlify`) + `@astrojs/sitemap`
- Plausible Analytics loaded in `Layout.astro`
- Redirect rules in `public/_redirects`
