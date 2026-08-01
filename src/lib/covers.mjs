/**
 * Cover art lives in the repo, and a cover is found by *convention* rather than
 * declared in frontmatter: the file for a book or game is whatever
 * `coverSlug()` names it, under src/content/now/images/.
 *
 * That's what lets the same title appear in several Now entries — "The Phoenix
 * Project" is in both January and May — and resolve to one file, downloaded
 * once. It's also why adding a book means running `pnpm covers` rather than
 * hand-editing a path into the entry.
 *
 * Plain .mjs on purpose: scripts/fetch-covers.mjs and NowEntry.astro both
 * import this, and a Node script can't load a .ts module without a flag. If
 * this ever needs types beyond JSDoc, the script is the thing to change.
 */

/**
 * Deterministic file stem for a piece of cover art.
 *
 * Books pass their author too: two different books can share a title, and the
 * author is what tells the files apart. Accents are folded rather than
 * stripped so "Les Fourmis" and "Les Fourmïs" can't collide silently.
 *
 * @param {string} title
 * @param {string} [author]
 * @returns {string} kebab-case stem, no extension
 */
export function coverSlug(title, author) {
  return [title, author]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // combining marks left over by NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Where the downloaded art lives, relative to the repo root.
 *
 * Deliberately not `images/`, which holds photos the author put there by hand.
 * This directory is script-owned — `pnpm covers --force` overwrites everything
 * in it — so nothing irreplaceable should ever sit here.
 */
export const COVER_DIR = "src/content/now/covers";
