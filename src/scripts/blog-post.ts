const SVG_NS = 'http://www.w3.org/2000/svg';

function makePath(d: string): SVGPathElement {
  const p = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
  p.setAttribute('d', d);
  p.setAttribute('stroke', 'currentColor');
  p.setAttribute('stroke-width', '1');
  p.classList.add('circuit-trace');
  return p;
}

function makeDot(cx: number, cy: number, r: number): SVGCircleElement {
  const c = document.createElementNS(SVG_NS, 'circle') as SVGCircleElement;
  c.setAttribute('cx', String(cx));
  c.setAttribute('cy', String(cy));
  c.setAttribute('r', String(r));
  c.setAttribute('fill', 'currentColor');
  c.classList.add('circuit-dot');
  return c;
}

function makeRect(x: number, y: number, w: number, h: number): SVGRectElement {
  const r = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
  r.setAttribute('x', String(x));
  r.setAttribute('y', String(y));
  r.setAttribute('width', String(w));
  r.setAttribute('height', String(h));
  r.setAttribute('stroke', 'currentColor');
  r.setAttribute('stroke-width', '1');
  r.setAttribute('fill', 'none');
  r.classList.add('circuit-rect');
  return r;
}

function animateTraces(svg: SVGSVGElement): number {
  let t = 0;
  svg.querySelectorAll<SVGPathElement>('.circuit-trace').forEach((path) => {
    const len = path.getTotalLength();
    const dur = Math.max(0.2, Math.min(len / 120, 0.55));
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.style.animation = `circuit-draw ${dur.toFixed(2)}s cubic-bezier(0.4,0,0.2,1) ${t.toFixed(2)}s forwards`;
    t += dur * 0.7;
  });
  svg.querySelectorAll<SVGElement>('.circuit-dot, .circuit-rect').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `circuit-appear 0.25s ease-out ${(t - 0.05 + i * 0.06).toFixed(2)}s forwards`;
  });
  return t;
}

function seededRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 0xFFFFFFFF; };
}

function injectTrace(heading: HTMLElement) {
  if (heading.querySelector('.heading-trace')) return;

  heading.style.display = 'flex';
  heading.style.alignItems = 'center';

  const rand = seededRand(heading.textContent?.trim() ?? '');
  const ri = (lo: number, hi: number) => Math.floor(rand() * (hi - lo + 1)) + lo;
  const pick = <T,>(opts: [T, number][]): T => {
    let r = rand() * opts.reduce((s, [, w]) => s + w, 0);
    for (const [v, w] of opts) { r -= w; if (r <= 0) return v; }
    return opts[opts.length - 1][0];
  };

  const Y = 1.5;
  const paths: string[] = [];
  const dots: [number, number, number][] = [];
  const rects: [number, number, number, number][] = [];
  let x = 0;

  const addLine    = (to: number)           => { paths.push(`M ${x} ${Y} L ${to} ${Y}`); x = to; };
  const addArcUp   = (r: number)            => { const x1 = x + 2*r; paths.push(`M ${x} ${Y} A ${r} ${r} 0 0 0 ${x1} ${Y}`); dots.push([x, Y, 1.75], [x1, Y, 1.75], [x+r, Y-r, 1.25]); x = x1; };
  const addArcDown = (r: number)            => { const x1 = x + 2*r; paths.push(`M ${x} ${Y} A ${r} ${r} 0 0 1 ${x1} ${Y}`); dots.push([x, Y, 1.75], [x1, Y, 1.75], [x+r, Y+r, 1.25]); x = x1; };
  const addTent    = (s: number)            => { paths.push(`M ${x} ${Y} L ${x+s} ${Y-s}`, `M ${x+s} ${Y-s} L ${x+2*s} ${Y}`); dots.push([x, Y, 1.75], [x+s, Y-s, 1.25], [x+2*s, Y, 1.75]); x += 2*s; };
  const addPad     = (w: number, h: number) => { rects.push([x, Y-h/2, w, h]); dots.push([x, Y, 1.5], [x+w, Y, 1.5]); x += w; };
  const addVia     = (h: number)            => { paths.push(`M ${x} ${Y} L ${x} ${Y-h}`); dots.push([x, Y, 1.75], [x, Y-h, 1.25]); };

  type Prim = 'arc-up' | 'arc-down' | 'tent' | 'pad' | 'via';

  const primary:   [Prim,        number][] = [['arc-up', 25], ['arc-down', 20], ['tent', 20], ['pad', 20], ['via', 15]];
  const secondary: [Prim | null, number][] = [[null, 45], ['arc-up', 12], ['arc-down', 10], ['tent', 10], ['pad', 8], ['via', 15]];

  const apply = (p: Prim) => {
    if (p === 'arc-up')   addArcUp(ri(10, 18));
    if (p === 'arc-down') addArcDown(ri(10, 15));
    if (p === 'tent')     addTent(ri(8, 13));
    if (p === 'pad')      addPad(ri(6, 10), ri(5, 9));
    if (p === 'via')      addVia(ri(8, 14));
  };

  addLine(ri(20, 50));
  apply(pick(primary));
  const sec = pick(secondary);
  if (sec) { addLine(x + ri(10, 25)); apply(sec); }
  addLine(x + 10);

  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('width', String(x));
  svg.setAttribute('height', '3');
  svg.setAttribute('viewBox', `0 0 ${x} 3`);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('overflow', 'visible');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('heading-trace');

  paths.forEach(d              => svg.appendChild(makePath(d)));
  rects.forEach(([rx,ry,rw,rh]) => svg.appendChild(makeRect(rx, ry, rw, rh)));
  dots.forEach(([cx,cy,r])     => svg.appendChild(makeDot(cx, cy, r)));

  const line = document.createElement('span');
  line.classList.add('heading-trace-line');
  line.setAttribute('aria-hidden', 'true');

  heading.appendChild(svg);
  heading.appendChild(line);

  const lineDelay = animateTraces(svg);
  line.style.animation = `heading-trace-draw 0.7s cubic-bezier(0.4,0,0.2,1) ${lineDelay.toFixed(2)}s forwards`;
  line.style.clipPath = 'inset(0 100% 0 0)';
}

function initHeadingTraces() {
  const headings = document.querySelectorAll<HTMLElement>('.prose h2, .prose h3');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        injectTrace(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  headings.forEach((h) => observer.observe(h));
}

function initReadingProgress() {
  const bar = document.getElementById('reading-progress') as HTMLElement | null;
  if (!bar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  document.addEventListener('astro:before-swap', () => {
    window.removeEventListener('scroll', update);
  }, { once: true });
}

document.addEventListener('astro:page-load', initHeadingTraces);
document.addEventListener('astro:page-load', initReadingProgress);
