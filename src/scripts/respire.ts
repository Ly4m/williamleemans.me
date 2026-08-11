/**
 * LA MACHINE RESPIRE — the ambient life layer.
 *
 * THESIS: the technical drawing is alive — the visitor never catches the
 *   sheet fully still, and every ~10s something on it is unmistakably
 *   moving. Refuses the category defaults: scroll-triggered reveals,
 *   hover-only life, particles.
 * OWN-WORLD: the incumbent vocabulary only — grid dots, circuit traces, the
 *   progress hairline — all in the decoration ink (--ink-circuit). No new
 *   metaphor, no brass (brass is state), no third register.
 * STORY: the drawing reads as maintained by an unseen hand — organique,
 *   mécanique, étrange — current in the wires, a hand correcting lines.
 * FIRST VIEWPORT: composition unchanged; dots breathe on the grid, a trace
 *   re-inks within seconds of arrival, a signal walks a wire.
 * FORM: extension of "Le schéma vivant" — the strangeness reserve spent by
 *   the owner's decision (2026-08-10), volume raised to "unmistakably
 *   alive" on the owner's second pass (« je veux passer au niveau
 *   supérieur »), overruling the reviewer's quieter reading.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with
 *   the finish review, the verdict, and DESIGN.md.
 *
 * Four instruments, one register:
 * — Breathing grid dots: intersections of the dot grid swell and fade, then
 *   wander; every so often a PULSE RUN — four adjacent dots lighting in
 *   sequence — crosses the paper like current. Grid pages only.
 * — Corrections: a visible circuit trace lifts off the sheet and re-draws
 *   itself; sometimes the hand redraws the whole plate. All pages — /now's
 *   plates included; the flow field itself is never touched.
 * — The walking signal: a dot of decoration ink traverses a visible trace,
 *   current in the wire. All pages.
 * — Wet ink: the reading hairline never quite dries (CSS, global.css).
 *
 * The whole layer is skipped under prefers-reduced-motion (the finished
 * drawing, already the reduced-motion ending of every other animation), and
 * every instrument pauses while the tab is hidden.
 */

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)");
const CELL = 20; // the dot grid's cell; dots sit at cell centers (10 + 20k)
const DOT_COUNT = 6;
const SVG_NS = "http://www.w3.org/2000/svg";

let timers: number[] = [];

const later = (fn: () => void, ms: number): void => {
  timers.push(window.setTimeout(fn, ms));
};

function clearAll(): void {
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
}

const grid = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(".blog-dot-grid");

const inView = (el: Element): boolean => {
  const r = el.getBoundingClientRect();
  return (
    r.bottom > 0 && r.top < window.innerHeight && (r.width > 0 || r.height > 0)
  );
};

/* — Breathing dots ------------------------------------------------------- */

function breathe(dot: HTMLElement): void {
  const cols = Math.floor(window.innerWidth / CELL);
  const rows = Math.floor(window.innerHeight / CELL);
  dot.style.left = `${CELL / 2 + CELL * Math.floor(Math.random() * cols)}px`;
  dot.style.top = `${CELL / 2 + CELL * Math.floor(Math.random() * rows)}px`;
  dot.style.animation = "none";
  void dot.offsetWidth; // restart the animation from zero
  dot.style.animation = `respire-dot ${(6 + Math.random() * 6).toFixed(1)}s ease-in-out ${(2 + Math.random() * 8).toFixed(1)}s 1`;
}

function seedDots(): void {
  const g = grid();
  if (!g) return;
  g.querySelectorAll(".respire-dot").forEach((d) => d.remove());
  for (let i = 0; i < DOT_COUNT; i++) {
    const dot = document.createElement("span");
    dot.className = "respire-dot";
    dot.addEventListener("animationend", () => breathe(dot));
    g.appendChild(dot);
    breathe(dot);
  }
}

/* A run of four adjacent dots lighting in sequence — current crossing the
   graph paper. The run's dots are transient; they remove themselves. */
function pulseRun(): void {
  const g = grid();
  if (g && !document.hidden) {
    const cols = Math.floor(window.innerWidth / CELL);
    const rows = Math.floor(window.innerHeight / CELL);
    const horizontal = Math.random() < 0.5;
    const len = 4;
    const x0 = Math.floor(Math.random() * Math.max(1, cols - len));
    const y0 = Math.floor(Math.random() * Math.max(1, rows - len));
    for (let i = 0; i < len; i++) {
      const dot = document.createElement("span");
      dot.className = "respire-dot";
      dot.style.left = `${CELL / 2 + CELL * (x0 + (horizontal ? i : 0))}px`;
      dot.style.top = `${CELL / 2 + CELL * (y0 + (horizontal ? 0 : i))}px`;
      dot.style.animation = `respire-dot 1.6s ease-in-out ${(i * 0.18).toFixed(2)}s 1`;
      dot.addEventListener("animationend", () => dot.remove());
      g.appendChild(dot);
    }
  }
  later(pulseRun, 20000 + Math.random() * 15000);
}

/* — Corrections ---------------------------------------------------------- */

function redraw(path: SVGPathElement, delay = 0): void {
  const length = path.getTotalLength();
  const dur = Math.max(0.5, Math.min(length / 150, 1.4));
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);
  path.style.animation = "none";
  void path.getBoundingClientRect();
  path.style.animation = `circuit-draw ${dur.toFixed(2)}s cubic-bezier(0.4, 0, 0.2, 1) ${delay.toFixed(2)}s forwards`;
}

function correct(): void {
  if (!document.hidden) {
    // Only traces the visitor can see: a correction spent off-screen thins
    // the whole story. No visible trace means the beat is skipped, never
    // spent blind — the schedule below keeps the rhythm either way.
    const traces = [
      ...document.querySelectorAll<SVGPathElement>("svg .circuit-trace"),
    ].filter(inView);
    if (traces.length) {
      const path = traces[Math.floor(Math.random() * traces.length)];
      if (Math.random() < 0.3 && path.ownerSVGElement) {
        // Sometimes the hand redraws the whole plate, in entrance stagger.
        path.ownerSVGElement
          .querySelectorAll<SVGPathElement>(".circuit-trace")
          .forEach((p, i) => redraw(p, i * 0.07));
      } else {
        redraw(path);
      }
    }
  }
  later(correct, 12000 + Math.random() * 14000);
}

/* — The walking signal --------------------------------------------------- */

function walk(): void {
  if (!document.hidden) {
    const candidates = [
      ...document.querySelectorAll<SVGPathElement>("svg .circuit-trace"),
    ].filter((p) => inView(p) && p.getTotalLength() > 60);
    if (candidates.length) {
      const path = candidates[Math.floor(Math.random() * candidates.length)];
      const svg = path.ownerSVGElement;
      const d = path.getAttribute("d");
      if (svg && d) {
        const dur = Math.max(2, Math.min(path.getTotalLength() / 120, 6));
        const dot = document.createElementNS(SVG_NS, "circle");
        dot.setAttribute("r", "1.5");
        dot.setAttribute("fill", "currentColor");
        dot.setAttribute("class", "respire-signal");
        dot.setAttribute("opacity", "0");
        const motion = document.createElementNS(SVG_NS, "animateMotion");
        motion.setAttribute("dur", `${dur.toFixed(2)}s`);
        motion.setAttribute("begin", "indefinite");
        motion.setAttribute("path", d);
        const fade = document.createElementNS(SVG_NS, "animate");
        fade.setAttribute("attributeName", "opacity");
        fade.setAttribute("values", "0;0.9;0.9;0");
        fade.setAttribute("keyTimes", "0;0.1;0.9;1");
        fade.setAttribute("dur", `${dur.toFixed(2)}s`);
        fade.setAttribute("begin", "indefinite");
        dot.append(motion, fade);
        svg.appendChild(dot);
        (motion as SVGAnimationElement).beginElement();
        (fade as SVGAnimationElement).beginElement();
        later(() => dot.remove(), (dur + 0.4) * 1000);
      }
    }
  }
  later(walk, 18000 + Math.random() * 18000);
}

/* — Lifecycle ------------------------------------------------------------ */

function init(): void {
  clearAll();
  if (REDUCE.matches) return;
  seedDots();
  // The hand shows itself within seconds of arrival, then keeps its rhythm.
  later(correct, 4000 + Math.random() * 4000);
  later(pulseRun, 6000 + Math.random() * 6000);
  later(walk, 8000 + Math.random() * 8000);
}

REDUCE.addEventListener("change", () => {
  if (REDUCE.matches) {
    clearAll();
    document
      .querySelectorAll(".respire-dot, circle.respire-signal")
      .forEach((d) => d.remove());
  } else {
    init();
  }
});

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", clearAll);

/* `astro:page-load` était le seul coup d'envoi, et il ne se rejoue pas : si ce
   module finit d'être évalué après son passage — réseau lent, cascade de
   modules — la page ne respirait jamais, sans que rien ne le signale. init()
   purge ses propres minuteurs avant de resemer, donc l'appeler deux fois ne
   coûte rien. */
if (document.readyState !== "loading") init();
