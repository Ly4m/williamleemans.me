/**
 * The site's colour tokens, restated for the surfaces that render outside the
 * document and so can't read a CSS custom property: the canvas (`FlowField.ts`)
 * and satori (`og-card.ts`).
 *
 * `src/styles/global.css` owns these values. This file mirrors them, and it is
 * the only file that does — check drift here, in one place, not in each
 * consumer. Each constant is named for the token it mirrors.
 *
 * One form per colour. A second exported form would be a second thing to keep
 * in step, which is the defect this module exists to remove — so values are hex
 * strings, and callers that need channels go through `toRGB()`.
 *
 * One surface stays outside: `public/favicon.svg` carries both brass values in
 * its own stylesheet, because a standalone SVG has nothing to import.
 * `scripts/generate-icons.mjs` reads them back out of that file.
 */

/** `--color-brass` — the site's single accent, dark-mode value. */
export const BRASS = "#E4A94D";

/** `--color-page` in dark mode. Not `--color-charcoal` (`#252525`). */
export const PAGE_DARK = "#1a1a1a";

/** `--color-primary-100` — the off-white. Also `--color-page` in light mode. */
export const PRIMARY_100 = "#fafafa";

/** `--color-faded` — muted text. */
export const FADED = "#858585";

/** `"#RRGGBB"` → `[r, g, b]`, for the canvas, which composes its own alpha. */
export const toRGB = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
