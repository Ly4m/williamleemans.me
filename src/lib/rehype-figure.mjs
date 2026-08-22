/**
 * Turn a lone markdown image into a numbered `<figure>`.
 *
 *     ![alt text](images/3/rebase-1.svg "La branche avant le rebase.")
 *
 * becomes
 *
 *     <figure>
 *       <img src="…" alt="alt text">
 *       <figcaption><span class="fig-num">Fig. 1</span> — La branche…</figcaption>
 *     </figure>
 *
 * The caption is the image's markdown TITLE — the third slot, the one nobody
 * uses — because that is the only way to caption a figure without giving up
 * Astro's image pipeline. Hand-writing `<figure><img src="images/…">` in the
 * markdown would emit a raw tag: the relative path never resolves against the
 * built page, and the `width`/`height`/`loading` Astro adds are lost with it.
 * So the wrapper is built here, after the image is already an element, and the
 * `src` is never touched.
 *
 * An image with no title is left exactly as it was. Captioning is a decision
 * per figure, not a transformation applied to every image on the site.
 *
 * Numbering is per document and counts only captioned figures, so `Fig. 2`
 * always refers to the second caption a reader has actually seen. The inline
 * `<svg>` diagrams in the CAP article carry hand-written `<figure>` blocks —
 * raw HTML never reaches this walk — and number themselves in the same
 * sequence; no article mixes the two kinds.
 */
export default function rehypeFigure() {
  /** @param {{ type: string, tagName?: string, properties?: any, children?: any[] }} tree */
  return (tree) => {
    let n = 0;

    /** @param {any} node */
    const walk = (node) => {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        if (child.type !== "element") return child;

        const img = loneImage(child);
        const caption = img?.properties?.title;

        if (!img || typeof caption !== "string" || !caption.trim()) {
          walk(child);
          return child;
        }

        n += 1;

        // The title has done its job; leaving it on would also make the
        // browser render the caption a second time as a tooltip.
        delete img.properties.title;

        return {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [
            img,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [
                {
                  type: "element",
                  tagName: "span",
                  properties: { className: ["fig-num"] },
                  children: [{ type: "text", value: `Fig. ${n}` }],
                },
                { type: "text", value: ` — ${caption.trim()}` },
              ],
            },
          ],
        };
      });
    };

    walk(tree);
  };
}

/**
 * The `<img>` inside a paragraph that holds nothing else. Markdown wraps a
 * standalone image in a `<p>`; a paragraph that also has words in it is prose
 * with an inline image, which is not a figure.
 *
 * @param {any} node
 * @returns {any | null}
 */
function loneImage(node) {
  if (node.tagName !== "p" || !Array.isArray(node.children)) return null;

  const meaningful = node.children.filter(
    (c) => !(c.type === "text" && !c.value.trim()),
  );

  return meaningful.length === 1 &&
    meaningful[0].type === "element" &&
    meaningful[0].tagName === "img"
    ? meaningful[0]
    : null;
}
