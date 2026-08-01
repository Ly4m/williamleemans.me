/**
 * Draw-on animation for the static header/margin/footer circuit decorations.
 * Imported by both layouts, since the decorations now appear on the dot-grid
 * pages (BlogLayout) and the flow-field pages (Layout).
 *
 * The heading traces injected into blog prose have their own, faster tuning in
 * blog-post.ts — a different register, deliberately not shared.
 *
 * Note that the draw-on works by commandeering stroke-dasharray: it sets the
 * dash to the path's own length and animates the offset to zero. Any
 * stroke-dasharray in a decoration's markup is therefore overwritten before it
 * can ever paint. Traces render solid by design — don't add dash patterns to
 * the SVGs expecting them to survive.
 */
function initCircuitAnimations() {
  // Animate each SVG independently so all decorations start at the same time.
  // Within each SVG, traces draw in DOM order with a small fixed stagger.
  document.querySelectorAll("svg").forEach((svg) => {
    const traces = svg.querySelectorAll<SVGPathElement>(".circuit-trace");
    if (!traces.length) return;

    traces.forEach((path, i) => {
      const length = path.getTotalLength();
      const dur = Math.max(0.4, Math.min(length / 180, 1.0));
      const delay = 0.05 + i * 0.07;
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.animation = `circuit-draw ${dur.toFixed(2)}s cubic-bezier(0.4, 0, 0.2, 1) ${delay.toFixed(2)}s forwards`;
    });

    svg
      .querySelectorAll<Element>(".circuit-dot, .circuit-rect, .circuit-label")
      .forEach((el, i) => {
        (el as HTMLElement).style.opacity = "0";
        (el as HTMLElement).style.animation =
          `circuit-appear 0.3s ease-out ${(0.55 + i * 0.06).toFixed(2)}s forwards`;
      });
  });
}

document.addEventListener("astro:page-load", initCircuitAnimations);
