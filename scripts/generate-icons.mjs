/**
 * Derives public/apple-touch-icon.png from public/favicon.svg.
 *
 *   pnpm icons
 *
 * iOS won't use an SVG for the home screen — it falls back to a screenshot of
 * the page — so the mark has to exist as a PNG too. Rather than draw it twice,
 * this reads favicon.svg and swaps its stylesheet for explicit values, so the
 * geometry lives in exactly one file.
 *
 * Two things the SVG doesn't need and the PNG does. iOS renders transparency
 * as black, so the plate is baked in; and a PNG can't carry a media query, so
 * one theme has to be chosen — the dark one, since home-screen icons sit on
 * arbitrary wallpaper and the dark plate reads against more of them.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "public/favicon.svg");
const OUT = join(ROOT, "public/apple-touch-icon.png");
const SIZE = 180;

// `--color-page` in dark mode. This one has to be declared: it's the plate the
// SVG never draws, and plain Node can't import src/lib/palette.ts.
const PAGE_DARK = "#1a1a1a";

const source = readFileSync(SRC, "utf8");

// The mark's colour is in the SVG's own stylesheet, so read it out rather than
// declare it again — the dark value, since that's the theme the plate is. The
// throw below is the falsifier for the colour too: change the favicon's shape
// and this stops, rather than silently inking the icon a stale brass.
const style = source.match(/<style>([\s\S]*?)<\/style>/);
if (!style) {
  throw new Error(
    `No <style> block in ${SRC} — has the favicon changed shape?`,
  );
}

const dark = style[1].match(
  /prefers-color-scheme:\s*dark[\s\S]*?stroke:\s*(#[0-9a-fA-F]{3,8})/,
);
if (!dark) {
  throw new Error(`No dark-mode stroke colour in ${SRC}'s stylesheet`);
}
const BRASS = dark[1];

// Drop the <style> block: it carries the two theme values, and a PNG gets one.
const withoutStyle = source.replace(/\s*<style>[\s\S]*?<\/style>/, "");

const plated = withoutStyle.replace(
  /(<svg\b[^>]*>)/,
  `$1\n    <rect width="128" height="128" fill="${PAGE_DARK}" />`,
);
if (plated === withoutStyle) throw new Error(`No <svg> element in ${SRC}`);

const inked = plated.replace(/<g\b/, `<g stroke="${BRASS}"`);
if (inked === plated) throw new Error(`No <g> to ink in ${SRC}`);

const png = new Resvg(inked, {
  fitTo: { mode: "width", value: SIZE },
}).render();

writeFileSync(OUT, png.asPng());
console.log(`apple-touch-icon.png — ${SIZE}×${SIZE}, ${BRASS} on ${PAGE_DARK}`);
