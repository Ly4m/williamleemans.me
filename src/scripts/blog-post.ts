const SVG_NS = "http://www.w3.org/2000/svg";

function makePath(d: string): SVGPathElement {
  const p = document.createElementNS(SVG_NS, "path") as SVGPathElement;
  p.setAttribute("d", d);
  p.setAttribute("stroke", "currentColor");
  p.setAttribute("stroke-width", "1");
  p.classList.add("circuit-trace");
  return p;
}

function makeDot(cx: number, cy: number, r: number): SVGCircleElement {
  const c = document.createElementNS(SVG_NS, "circle") as SVGCircleElement;
  c.setAttribute("cx", String(cx));
  c.setAttribute("cy", String(cy));
  c.setAttribute("r", String(r));
  c.setAttribute("fill", "currentColor");
  c.classList.add("circuit-dot");
  return c;
}

function makeRect(x: number, y: number, w: number, h: number): SVGRectElement {
  const r = document.createElementNS(SVG_NS, "rect") as SVGRectElement;
  r.setAttribute("x", String(x));
  r.setAttribute("y", String(y));
  r.setAttribute("width", String(w));
  r.setAttribute("height", String(h));
  r.setAttribute("stroke", "currentColor");
  r.setAttribute("stroke-width", "1");
  r.setAttribute("fill", "none");
  r.classList.add("circuit-rect");
  return r;
}

/**
 * Ink the trace on, left to right, and return the moment the last segment
 * finishes so the junction dots can land behind the drawing front rather than
 * on a fixed stagger that stopped being true when the trace got longer.
 *
 * 300px/s: a section trace runs the whole measure, and the 120px/s the short
 * inline stub used would have taken five seconds to cross it.
 */
function animateTraces(svg: SVGSVGElement): number {
  let t = 0;
  svg.querySelectorAll<SVGPathElement>(".circuit-trace").forEach((path) => {
    const len = path.getTotalLength();
    const dur = Math.max(0.25, Math.min(len / 300, 0.9));
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.style.animation = `circuit-draw ${dur.toFixed(2)}s cubic-bezier(0.4,0,0.2,1) ${t.toFixed(2)}s forwards`;
    t += dur * 0.75;
  });
  svg
    .querySelectorAll<SVGElement>(".circuit-dot, .circuit-rect")
    .forEach((el, i) => {
      el.style.opacity = "0";
      el.style.animation = `circuit-appear 0.25s ease-out ${(t - 0.05 + i * 0.06).toFixed(2)}s forwards`;
    });
  return t;
}

function seededRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
}

type Prim = "arc-up" | "arc-down" | "tent" | "pad" | "via";

/** The widest any single feature can consume, used to decide whether one more
 *  still fits before the run-out. Keep in step with `apply` below. */
const WIDEST = 36;

/**
 * Draw one section trace, exactly `width` wide.
 *
 * The baseline is drawn here rather than left to a CSS rule underneath,
 * because the arcs and tents in this vocabulary REPLACE a segment of the line
 * — `BlogPostDecoration` goes line, arc dome, line, and never both at once. A
 * continuous CSS hairline with an arc on top would close the arc into a loop,
 * which is a shape this drawing does not own. The cost is that the trace is
 * JavaScript's to make: before it runs, h2 and h3 are separated by their size
 * step alone.
 */
function buildTrace(width: number, seed: string): SVGSVGElement {
  const rand = seededRand(seed);
  const ri = (lo: number, hi: number) =>
    Math.floor(rand() * (hi - lo + 1)) + lo;
  const pick = <T>(opts: [T, number][]): T => {
    let r = rand() * opts.reduce((s, [, w]) => s + w, 0);
    for (const [v, w] of opts) {
      r -= w;
      if (r <= 0) return v;
    }
    return opts[opts.length - 1][0];
  };

  const Y = 1.5;
  const paths: string[] = [];
  const dots: [number, number, number][] = [];
  const rects: [number, number, number, number][] = [];
  let x = 0;

  const addLine = (to: number) => {
    if (to <= x) return;
    paths.push(`M ${x} ${Y} L ${to} ${Y}`);
    x = to;
  };
  // Sweep flag 1 arcs above the baseline, 0 below — left-to-right between two
  // points at equal y. Not the other way round; verified against getBBox.
  const addArcUp = (r: number) => {
    const x1 = x + 2 * r;
    paths.push(`M ${x} ${Y} A ${r} ${r} 0 0 1 ${x1} ${Y}`);
    dots.push([x, Y, 1.75], [x1, Y, 1.75], [x + r, Y - r, 1.25]);
    x = x1;
  };
  const addArcDown = (r: number) => {
    const x1 = x + 2 * r;
    paths.push(`M ${x} ${Y} A ${r} ${r} 0 0 0 ${x1} ${Y}`);
    dots.push([x, Y, 1.75], [x1, Y, 1.75], [x + r, Y + r, 1.25]);
    x = x1;
  };
  const addTent = (s: number) => {
    paths.push(
      `M ${x} ${Y} L ${x + s} ${Y - s}`,
      `M ${x + s} ${Y - s} L ${x + 2 * s} ${Y}`,
    );
    dots.push([x, Y, 1.75], [x + s, Y - s, 1.25], [x + 2 * s, Y, 1.75]);
    x += 2 * s;
  };
  const addPad = (w: number, h: number) => {
    rects.push([x, Y - h / 2, w, h]);
    dots.push([x, Y, 1.5], [x + w, Y, 1.5]);
    x += w;
  };
  const addVia = (h: number) => {
    paths.push(`M ${x} ${Y} L ${x} ${Y - h}`);
    dots.push([x, Y, 1.75], [x, Y - h, 1.25]);
  };

  const apply = (p: Prim) => {
    if (p === "arc-up") addArcUp(ri(10, 18));
    if (p === "arc-down") addArcDown(ri(10, 15));
    if (p === "tent") addTent(ri(8, 13));
    if (p === "pad") addPad(ri(6, 10), ri(5, 9));
    if (p === "via") addVia(ri(8, 14));
  };

  const kinds: [Prim, number][] = [
    ["arc-up", 25],
    ["arc-down", 20],
    ["tent", 20],
    ["pad", 20],
    ["via", 15],
  ];

  // A phone gets one event on the line and a long desktop measure gets three:
  // the trace should read as sparse instrumentation on a run of wire, not as a
  // busy strip, and the run is less than half as long at 390px.
  const wanted = width < 420 ? 1 : width < 700 ? 2 : 3;
  const runOut = 40;

  addLine(ri(28, 64));

  for (let placed = 0; placed < wanted; placed++) {
    if (x + WIDEST > width - runOut) break;
    apply(pick(kinds));
    if (placed < wanted - 1) {
      addLine(Math.min(x + ri(50, 130), width - runOut - WIDEST));
    }
  }

  addLine(width);

  const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", "3");
  svg.setAttribute("viewBox", `0 0 ${width} 3`);
  svg.setAttribute("fill", "none");
  // Arcs, tents and vias rise above the baseline into the heading's own top
  // margin. Clipping them to the 3px box would flatten every feature away.
  svg.setAttribute("overflow", "visible");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("heading-trace");

  /* Positioning is written inline, not left to the class alone. This element
     is a full-measure block created by script: if `.heading-trace` is missing
     or stale for even a moment — a half-swapped stylesheet, a cached older
     build — an unpositioned copy lands in the heading's flow and pushes a
     second wire out under the words. That failure was seen, and it is the kind
     the reader notices and the tests do not. The class still carries the ink
     and the pointer-events; only the geometry is pinned here. */
  svg.style.position = "absolute";
  // SOUS le titre : le tracé souligne sa section au lieu de l'annoncer.
  svg.style.bottom = "0";
  svg.style.left = "0";
  /* Et les accidents basculent vers le BAS. Arcs, tentes et vias sont bâtis
     au-dessus de la ligne de base (`Y - r`) : c'était juste quand le fil
     surmontait le titre et montait dans sa marge, ça ne l'est plus quand il le
     souligne — ils viendraient piquer dans les jambages. Le retournement se
     fait en une transformation plutôt qu'en inversant chaque `sweep-flag` et
     chaque signe dans `buildTrace` : la boîte fait 3px de haut, son origine de
     transformation tombe donc à 1.5px, exactement sur la ligne de base. Le fil
     ne bouge pas d'un pixel, seuls ses accidents changent de côté. */
  svg.style.transform = "scaleY(-1)";

  paths.forEach((d) => svg.appendChild(makePath(d)));
  rects.forEach(([rx, ry, rw, rh]) =>
    svg.appendChild(makeRect(rx, ry, rw, rh)),
  );
  dots.forEach(([cx, cy, r]) => svg.appendChild(makeDot(cx, cy, r)));

  return svg;
}

/**
 * A section trace under an h2 — the rule that underlines a new region of the
 * sheet. It sat ABOVE the heading until 2026-08-25; moved below, it reads as
 * the title's own underline rather than as a separator floating over it.
 *
 * It replaces a short trace that was injected INSIDE every h2 and h3 and ran
 * off to the right of the words. That stub took its length from whatever the
 * heading left over: 39–100px on the long French headings this blog writes,
 * and on a phone it stole a seventh of the line and forced an extra wrap. It
 * also gave both levels the same mark, so the only thing separating an h2 from
 * an h3 was 4px of type. Now h2 is announced and h3 is not.
 */
function injectSectionTrace(heading: HTMLElement, animate: boolean) {
  const width = Math.round(heading.clientWidth);
  if (width < 120) return;

  heading.querySelector(".heading-trace")?.remove();

  const svg = buildTrace(width, heading.textContent?.trim() ?? "");
  heading.appendChild(svg);

  if (animate) animateTraces(svg);
}

function initHeadingTraces() {
  const headings = [
    ...document.querySelectorAll<HTMLElement>(".prose h2"),
  ] as HTMLElement[];
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        injectSectionTrace(entry.target as HTMLElement, true);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  headings.forEach((h) => observer.observe(h));

  // The trace is drawn at a measured pixel width, so a resize leaves it either
  // short of the column or hanging past it. Redraw the ones already placed —
  // without the entrance, because a resize is not an arrival.
  let timer: number | undefined;
  const onResize = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      headings.forEach((h) => {
        if (h.querySelector(".heading-trace")) injectSectionTrace(h, false);
      });
    }, 150);
  };

  window.addEventListener("resize", onResize, { passive: true });

  document.addEventListener(
    "astro:before-swap",
    () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    },
    { once: true },
  );
}

function initReadingProgress() {
  const bar = document.getElementById("reading-progress") as HTMLElement | null;
  if (!bar) return;

  const update = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();

  document.addEventListener(
    "astro:before-swap",
    () => {
      window.removeEventListener("scroll", update);
    },
    { once: true },
  );
}

document.addEventListener("astro:page-load", initHeadingTraces);
document.addEventListener("astro:page-load", initReadingProgress);
