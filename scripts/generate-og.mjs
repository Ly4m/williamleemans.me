// Rasterizes public/og/default.svg -> public/og/default.jpg (1200x630).
// Run with: node scripts/generate-og.mjs
// `sharp` is a transitive dependency (via Astro's image service), so we resolve
// it from the pnpm store rather than expecting it as a direct dependency.
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function resolveSharp() {
  try {
    return require("sharp");
  } catch {
    const pnpmDir = "node_modules/.pnpm";
    const entry = readdirSync(pnpmDir).find((d) => d.startsWith("sharp@"));
    if (!entry) throw new Error("sharp not found in node_modules/.pnpm");
    return require(`${process.cwd()}/${pnpmDir}/${entry}/node_modules/sharp`);
  }
}

const sharp = resolveSharp();
const svg = readFileSync("public/og/default.svg");

const info = await sharp(svg, { density: 144 })
  .resize(1200, 630)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/og/default.jpg");

console.log(
  `Wrote public/og/default.jpg (${info.width}x${info.height}, ${info.size} bytes)`,
);
