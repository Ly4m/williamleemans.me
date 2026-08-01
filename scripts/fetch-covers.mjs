/**
 * Downloads cover art for every book and game in the Now entries.
 *
 *   pnpm covers            # fill in what's missing
 *   pnpm covers --force    # re-download everything
 *
 * This used to happen during `astro build`, inside NowEntry.astro. That made
 * every deploy depend on openlibrary.org and rawg.io being up and fast — about
 * 17 seconds of a 21-second build — and the failure mode was silent: a missing
 * RAWG key or a slow upstream shipped a Now page with no covers and no error.
 *
 * So it moved here. The build now reads files that are already in the repo;
 * this script is the only thing that talks to the network, it runs when you add
 * a book, and if it fails it fails loudly in front of you.
 *
 * Game art needs a free RAWG key: put RAWG_API_KEY in .env (see .env.example).
 * Book covers need nothing.
 */
import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { parse } from "yaml";
import { coverSlug, COVER_DIR } from "../src/lib/covers.mjs";

const NOW_DIR = "src/content/now";
const force = process.argv.includes("--force");
const rawgKey = process.env.RAWG_API_KEY ?? "";

/** Frontmatter block of a markdown file, parsed. */
function frontmatter(path) {
  const raw = readFileSync(path, "utf8");
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return block ? (parse(block[1]) ?? {}) : {};
}

async function searchOpenLibrary(query) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=cover_i`,
  );
  if (!res.ok) throw new Error(`openlibrary ${res.status}`);
  const coverId = (await res.json()).docs?.[0]?.cover_i;
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;
}

async function findBookCover(title, author) {
  // Author first, because titles collide. But a multi-author string like
  // "Gene Kim, George Spafford et Kevin Behr" matches nothing, so a title-only
  // pass is worth a second request before giving up.
  return (
    (await searchOpenLibrary(`${title} ${author}`)) ??
    (await searchOpenLibrary(title))
  );
}

async function findGameCover(title) {
  if (!rawgKey) return null;
  const q = encodeURIComponent(title);
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${rawgKey}&search=${q}&page_size=1`,
  );
  if (!res.ok) throw new Error(`rawg ${res.status}`);
  return (await res.json()).results?.[0]?.background_image ?? null;
}

/*
 * Downscaled on the way in. RAWG serves 1920px key art and OpenLibrary's large
 * covers run to 1000px, but a card is ~160px wide for a book and ~215px for a
 * game — even at 2× that's an order of magnitude of waste, and it's waste the
 * repo would carry forever. Full-size downloads came to 14 MB.
 *
 * The cap is generous rather than exact: Astro still resizes these at build
 * time, so this only has to be small enough not to bloat the repo and large
 * enough that a future wider layout isn't stuck with mush.
 */
const MAX_WIDTH = { book: 500, game: 720 };

async function download(url, dest, kind) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: MAX_WIDTH[kind], withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
}

mkdirSync(COVER_DIR, { recursive: true });
const onDisk = new Set(
  readdirSync(COVER_DIR).map((f) => f.replace(/\.[^.]+$/, "")),
);

// One entry per unique slug: the same title in two months is one file.
const wanted = new Map();
for (const file of readdirSync(NOW_DIR).filter((f) => f.endsWith(".md"))) {
  const data = frontmatter(join(NOW_DIR, file));
  for (const book of data.books ?? []) {
    wanted.set(coverSlug(book.title, book.author), {
      kind: "book",
      ...book,
    });
  }
  for (const game of data.games ?? []) {
    wanted.set(coverSlug(game.title), { kind: "game", ...game });
  }
}

const todo = [...wanted].filter(([slug]) => force || !onDisk.has(slug));
console.log(
  `${wanted.size} titles, ${onDisk.size} already downloaded, ${todo.length} to fetch.`,
);
if (!rawgKey && todo.some(([, item]) => item.kind === "game")) {
  console.warn("! RAWG_API_KEY is not set — game covers will be skipped.");
}

let ok = 0;
const missing = [];
for (const [slug, item] of todo) {
  try {
    // An explicit `coverUrl` in the entry wins: it's the escape hatch for
    // anything the search gets wrong or can't find.
    const url =
      item.coverUrl ??
      (item.kind === "book"
        ? await findBookCover(item.title, item.author)
        : await findGameCover(item.title));
    if (!url) {
      missing.push(`${slug} (no result)`);
      continue;
    }
    await download(url, join(COVER_DIR, `${slug}.jpg`), item.kind);
    console.log(`  ✓ ${slug}`);
    ok++;
  } catch (err) {
    missing.push(`${slug} (${err.message})`);
  }
}

console.log(`\nDownloaded ${ok}/${todo.length}.`);
if (missing.length) {
  // Not a hard failure: a title with no cover renders fine without one. But it
  // says so here rather than disappearing quietly the way the build used to.
  console.log(
    `\nNo cover for ${missing.length}:\n${missing.map((m) => `  - ${m}`).join("\n")}\n` +
      `Drop a file named <slug>.jpg into ${COVER_DIR}/ to supply one by hand.`,
  );
}
