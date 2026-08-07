# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project rules

These are deliberate. Don't "fix", generalise, or harmonise them away.

- **French-first.** All visitor-facing copy, navigation, and metadata are in French; English only in code identifiers and developer-facing files. Exactly two nav labels stay English, and they are named here — no others: **Now** (a borrowed term from nownownow.com; the route stays `/now`, and the page heading may still read "Maintenant") and **Talks** (the word the French tech scene actually uses; "Conférences" is ambiguous between the talks given and the events attended). Routes match the labels: `/now`, `/talks`.
- **Monochrome, plus one brass accent.** Charcoal / off-white / faded gray carry text, backgrounds, and structure. Brass is the site's single accent: use it sparingly, on lines and state, never on running text. `--color-brass` (`#E4A94D`) in dark, `--color-brass-ink` (`#8f6a1a`) in light — the darker value is required for contrast on `#fafafa`, where the true brass manages only 1.9:1. (Shiki's full-spectrum syntax colours inside code blocks sit outside this system.)
- **Craft wins by default.** When visual flourish conflicts with clarity or performance, flourish wins — the animations and decorations are the point of the site. Two exceptions: a defect is not craft (broken OG images, inconsistent canonical URLs, broken rendering are fixed regardless), and `prefers-reduced-motion: reduce` overrides craft.
- **No `/work` route, no CV section.** The home page is a personal introduction in the owner's voice, not a portfolio or sales surface. Professional credibility is carried by inline links (Jetdev, Scanzee), the blog, and `/talks`. **`/talks` is an archive of talks already given — nothing more.** It deliberately carries no list of topics on offer, no availability flag, and no speaker kit (no third-person bio, no press photo, no rates, no calendar). A single closing line in the owner's voice says the talks are given in French from Lille and invites an email; that line is the whole of the page's address to conference organisers, and it stays prose rather than becoming data.
- **IndieWeb: the spirit and a verifiable identity, not the social protocol.** `hello-world.md` claims the movement, and the claim is about owning the space — not about implementing its specs. **`rel="me"` is the only convention adopted**, and only on the two profiles (GitHub, LinkedIn) — never on the feed or the `mailto:`, which carry no identity to claim. It is marked on the data (`profile: true` in `SideNav.astro`'s `socialLinks`), not derived from the URL. `rel="me"` is **bidirectional**: the GitHub profile links back to `lmns.fr` from its social accounts, which is what makes the mark mean anything. **LinkedIn will never verify** — it strips outbound `rel` — and that is accepted, not a defect; don't remove it. **h-card and webmentions are ruled out, not overlooked**: the h-card's only consumer is the social protocol we're declining, and webmentions cost a third-party custodian, moderation, and a display surface, against six articles in nine months and no Mastodon. The JSON-LD `Person` on the home page stays the site's only identity vocabulary; there is no second one to keep in step.
- **The guard informs; the build blocks.** A malformed **datum** fails `pnpm build` — `pubDate` must be `YYYY-MM-DD`, zeros included, or `content.config.ts` rejects it (a bare `2025-11-6` is read as _local_ midnight and slips a day into the page, the feed and the sitemap). A quality **finding** never fails anything: `scripts/guard.mjs` exits 0 however red it is, and posts its report as a single PR comment, rewritten in place, next to the Merge button. Four refusals are deliberate, not gaps. **No browser, ever** — axe-core runs under jsdom, which is what makes `color-contrast` _structurally_ incapable of firing; a real Chrome reports 342 contrast violations in light mode, of which 243 are Shiki's palette and 2 are `--color-brass-ink` itself, i.e. this file's own decisions. The best disabled rule is one nobody can re-enable by accident, so **don't add Lighthouse, pa11y or `@axe-core/playwright` to "improve coverage"** — that is the coverage we measured and declined. **No fifth family, and `html-validate` in particular is refused on a measurement rather than a taste** — the site renders _one_ navigation twice (the rail is `display:none` under `md`, the mobile menu is `inert` until opened), so only ever one is in the accessibility tree; but `unique-landmark` does a bare `querySelectorAll` and consults neither `inert` nor style, while `wcag/h30` consults `inert` in the same run on the same file. It therefore demands two different names for one nav — unsatisfiable without lying in the HTML — and reaching even that verdict costs six disabled rules against 1077 surviving messages, 995 of them Shiki's inline styles. Its one true find, a `&nbsp` missing its semicolon, is already fixed. Re-open the question if, and only if, `unique-landmark` starts calling the `inAccessibilityTree()` the tool already ships. **The weight budget bounds the shell, never the pictures**: per-page gzipped HTML / CSS / JS against 20 / 20 / 12 KiB, because 6.1 MB of `dist/` is cover art and flourish wins. Fonts are counted by _family_, not by byte — @fontsource emits 62 files whose `unicode-range` a French page will never fetch. And the guard carries five hand-written assertions no off-the-shelf rule provides, all holding up the skip link: exactly one `<main id="contenu">`, its `tabindex="-1"`, no positive `tabindex`, and the skip link first in keyboard order.

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm preview    # Preview production build locally
pnpm guard      # Run the a11y / content / weight guard over dist/ (needs a build first)
```

No test or lint commands are configured; code quality is managed via Prettier (`.prettierrc` with astro and tailwindcss plugins). `pnpm guard` is the local half of the CI guard — the link half is `lychee`, a separate binary CI installs and you may not have.

## Architecture

Personal portfolio/blog site built with **Astro 6** + **Svelte 5** (for interactive components), styled with **Tailwind CSS 4**, deployed to Netlify.

### Content Layer

Astro Content Collections (`src/content/`) with Zod schema validation in [`src/content.config.ts`](src/content.config.ts):

- **`blog/`** — Markdown posts. Schema: `slug` (used for the URL), `title`, `description`, `pubDate`, `readingTime`, optional `ogImage`. Images live in `blog/images/`.
- **`now/`** — "Now" page entries (nownownow.com style). Schema: `slug`, `title`, `pubDate`, optional `lang`, and optional structured `books`/`games` lists.

Static paths are generated at build time; the RSS feed at `src/pages/rss.xml.js` pulls from the blog collection **only** — the feed is titled "William Leemans | Blog" and stays articles-only.

Not everything structured is a collection. `src/data/` holds typed modules for data with no markdown body: `nav.ts` (the primary nav, shared by both layouts) and `talks.ts`. In `talks.ts` the unit is the _talk_, not the performance: one entry carries N occurrences, so a talk given at three conferences appears once. Every entry has at least one occurrence — the page is an archive, and a talk that hasn't been given has no row.

### Routing

| Path           | File                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| `/`            | `src/pages/index.astro`                                                                      |
| `/blog`        | `src/pages/blog.astro`                                                                       |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` (routed by the post's `slug` frontmatter, not file id)         |
| `/talks`       | `src/pages/talks.astro` (data in `src/data/talks.ts`, not a collection — a talk has no body) |
| `/now`         | `src/pages/now/index.astro`                                                                  |
| `/now/[id]`    | `src/pages/now/[id].astro`                                                                   |
| `/rss.xml`     | `src/pages/rss.xml.js`                                                                       |

Old file-id blog URLs (`/blog/26-01-rss`, etc.) 301-redirect to their slug URLs via `public/_redirects`.

### Key Components

- **`FlowField.svelte`** — Canvas animation for the Now pages: slow, drifting streamlines following a simplex flow field, leaving smearing tails (eerie/organic). Charcoal in light mode, warm brass (`#E4A94D`) in dark. Reads dark/light theme from `document.documentElement.classList` each frame. The underlying logic lives in `src/lib/FlowField.ts`. Renders a single static frame when `prefers-reduced-motion: reduce` is set.
- **`SideNav.astro`** — Fixed left sidebar on desktop; full-screen overlay on mobile with hamburger toggle and theme toggle.
- **Two layouts, by design** — `Layout.astro` renders the **flow-field** background and is used by the **Now** pages; `BlogLayout.astro` renders a static **dot-grid** background and is used by **Home, Blog, blog posts, and Talks**. Both are the same thin-line primitive in different registers (flowing vs constrained) — one visual language, not two metaphors; don't introduce a third. Both inline the same theme-init script (prevents theme flash), meta (`OpenGraphMeta`/`TwitterMeta`, absolute OG URLs, optional `structuredData` JSON-LD), and `SideNav`.

### Styling Conventions

- Tailwind CSS 4 (Vite plugin, not PostCSS). Config is in `astro.config.mjs`.
- Custom CSS variables defined in `src/styles/global.css` (`--color-primary-100`, `--color-charcoal`, `--color-faded`).
- **Decoration ink is a token, not a literal.** The hand-drawn circuit SVGs all take their colour from `--ink-circuit` (grey in light, knocked-back brass in dark), with `--ink-circuit-strong` for `NowDecoration` alone, which sits over the moving flow field and needs the extra weight. Never hard-code the ink in a decoration again. Two surfaces can't read CSS variables. **`src/lib/palette.ts` restates the tokens** for the canvas (`FlowField.ts`) and satori (`og-card.ts`), which import it — it is the only file that mirrors `global.css`, so drift is checked in one place, not in each consumer. It exports hex strings and a `toRGB()`; a second exported form would be a second thing to keep in step. **`public/favicon.svg` carries both brass values itself**, because a standalone SVG has nothing to import — and `scripts/generate-icons.mjs` (rasteriser) reads the dark one back out of that stylesheet rather than declaring a third copy. One value in `FlowField.ts` is deliberately _not_ a token: `LIGHT_INK_RGB` (`#2C2C30`) was set by eye in the prototype session and mirrors nothing; don't snap it to `--color-charcoal`.
- `@tailwindcss/typography` for blog post prose; `@iconify/tailwind4` with tabler icons for icons.
- Dark mode toggled by adding/removing the `dark` class on `<html>`, persisted in `localStorage`. **This is why `theme-color` is set from JS, not a media query** — `prefers-color-scheme` would ignore the toggle and leave a white browser bar above a charcoal page. The mobile bar copies `--color-page`, the token the page background itself uses, so the two can't drift; see `src/lib/theme-color.ts`, whose logic both layouts inline because their theme script is `is:inline`.
- **The site's mark is the initials in brass**, `public/favicon.svg` — plain `WL`, no circuit vocabulary, brass-ink in light and true brass in dark. `pnpm icons` derives `public/apple-touch-icon.png` (180×180, brass on a charcoal plate, since iOS renders transparency as black) from that one file, so the geometry is never drawn twice. A `WL` doesn't survive a 16px favicon in the abstract — a legible `W` alone needs the full width — so the weight is tuned for it; don't thin the strokes.
- Custom animations: `wave-enter` (staggered children), `slide-down`, `name-expand`.

### Fonts

- `@fontsource/space-grotesk` — headings
- `@fontsource/ibm-plex-mono` — body and code

### Markdown / Syntax Highlighting

Shiki with dual themes: `vitesse-light` (light mode) and `vitesse-dark` (dark mode), configured in `astro.config.mjs`. Shiki emits both palettes as CSS variables but only wires up the light one — `global.css` flips tokens to `--shiki-dark` under `.dark` (with `!important`, since Shiki writes inline styles). The `<pre>` background is forced flush with the page in **both** themes (`#fafafa` light, `#1a1a1a` dark) rather than the theme's own — vitesse-light's `#ffffff` otherwise read as a faint card the dark mode didn't have — and syntax colours snap on theme toggle rather than transitioning.

### Site Config

- Production URL: `https://lmns.fr` (set in `astro.config.mjs`)
- Netlify adapter (`@astrojs/netlify`) + `@astrojs/sitemap`
- Plausible Analytics loaded in `Layout.astro`
- Redirect rules in `public/_redirects`
