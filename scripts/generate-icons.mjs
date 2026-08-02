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
 * one theme has to be chosen — charcoal, since home-screen icons sit on
 * arbitrary wallpaper and the dark plate reads against more of them.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "public/favicon.svg");
const OUT = join(ROOT, "public/apple-touch-icon.png");
const SIZE = 180;

// Mirrors global.css, like og-card.ts and FlowField.ts — a rasteriser can't
// read the custom properties either.
const BRASS = "#E4A94D";
const CHARCOAL = "#1a1a1a";

const source = readFileSync(SRC, "utf8");

// Drop the <style> block: it carries the two theme values, and a PNG gets one.
const withoutStyle = source.replace(/\s*<style>[\s\S]*?<\/style>/, "");
if (withoutStyle === source) {
  throw new Error(
    `No <style> block in ${SRC} — has the favicon changed shape?`,
  );
}

const plated = withoutStyle.replace(
  /(<svg\b[^>]*>)/,
  `$1\n    <rect width="128" height="128" fill="${CHARCOAL}" />`,
);
if (plated === withoutStyle) throw new Error(`No <svg> element in ${SRC}`);

const inked = plated.replace(/<g\b/, `<g stroke="${BRASS}"`);
if (inked === plated) throw new Error(`No <g> to ink in ${SRC}`);

const png = new Resvg(inked, {
  fitTo: { mode: "width", value: SIZE },
}).render();

writeFileSync(OUT, png.asPng());
console.log(`apple-touch-icon.png — ${SIZE}×${SIZE}, brass on charcoal`);
