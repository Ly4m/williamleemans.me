/**
 * Wrap every markdown `<table>` in a `.table-scroll` div so a wide table
 * scrolls inside itself instead of panning the whole page on mobile — the
 * treatment `<pre>` already gets. A wrapper div rather than `display: block`
 * on the table itself, because that display change strips the table's roles
 * from the accessibility tree.
 */
export default function rehypeTableScroll() {
  /** @param {{ type: string, tagName?: string, children?: any[] }} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === "element" && child.tagName === "table") {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [child],
        };
      }
      walk(child);
      return child;
    });
  };
  return walk;
}
