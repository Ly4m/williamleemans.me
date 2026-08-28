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
function buildTrace(width: number, seed: string, ext: number): SVGSVGElement {
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
  //
  // Compté sur la MESURE et non sur la largeur totale : l'extension vers le bus
  // ne rend pas la colonne plus large. Sans le `- ext`, un article de bureau
  // passait de deux accidents à trois le jour où on lui a ajouté 56px de fil
  // nu — une densité qui change sans que personne ne l'ait demandée.
  const wanted = width - ext < 420 ? 1 : width - ext < 700 ? 2 : 3;
  const runOut = 40;

  // LE SAS, en deux plages parce que sa longueur utile dépend de ce qu'il y a
  // devant. Étendue, la trace part du bus et traverse déjà 56px de marge nue
  // avant d'atteindre la colonne : 8–32 de plus suffisent. Non étendue (sous
  // `xl`, où les bus n'existent pas), elle démarre au bord du texte et il lui
  // faut ses 28–64 d'origine. Un seul nombre ne peut pas être juste dans les
  // deux cas — et l'extension elle-même reste NUE : aucun accident ne tombe
  // dans la marge, ils restent tous à l'aplomb de la colonne.
  addLine(ext + (ext > 0 ? ri(8, 32) : ri(28, 64)));

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
  // Le tracé démarre AU BUS, donc la boîte recule d'autant.
  svg.style.left = `${-ext}px`;
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
/**
 * De combien la trace doit dépasser à gauche pour atteindre le bus de
 * l'article — 0 quand les bus n'existent pas.
 *
 * La valeur est LUE, pas redéclarée : `--bus-offset` vit dans `global.css`, qui
 * s'en sert aussi pour poser les bus, les points de jonction et les pads. Un
 * second `56` ici serait un second endroit à corriger, et le décalage se
 * verrait comme un fil qui rate son point de deux pixels — le genre de dérive
 * que personne ne remarque et qu'aucun test n'attrape.
 *
 * Le seuil `80rem` est celui du `@media` qui allume les bus. Les deux doivent
 * rester d'accord : sous ce seuil, une trace étendue partirait dans le vide.
 */
const BUS_MQ = "(min-width: 80rem)";

function busExtension(): number {
  if (!window.matchMedia(BUS_MQ).matches) return 0;
  const v = getComputedStyle(document.documentElement).getPropertyValue(
    "--bus-offset",
  );
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function injectSectionTrace(heading: HTMLElement, animate: boolean) {
  const ext = busExtension();
  const width = Math.round(heading.clientWidth) + ext;
  if (width - ext < 120) return;

  heading.querySelector(".heading-trace")?.remove();

  const svg = buildTrace(width, heading.textContent?.trim() ?? "", ext);
  heading.appendChild(svg);

  if (animate) animateTraces(svg);
}

/* ---------------------------------------------------------------------------
   LE SOMMAIRE SUIT LA LECTURE — et c'est un revirement, daté du 2026-08-28.

   Jusque-là le sommaire était STATIQUE, et trois endroits l'écrivaient :
   la note 1 de `TableOfContents.astro`, `DESIGN.md` et son « Don't ». Trois
   raisons y étaient données ; une seule est tombée.

   CE QUI TOMBE : « la position dans l'article appartient à
   `#reading-progress` ». La barre donne une PROPORTION — 62 % — et ne peut
   structurellement pas donner un NOM. Le sommaire, lui, nomme. Les deux
   instruments ne répondaient pas à la même question, et celui qui répondait à
   « où suis-je » ne répondait qu'en pourcentage.

   CE QUI TIENT, et qui est PAYÉ plutôt qu'écarté :

   1. LA RÈGLE DU SIGNAL UNIQUE — non pas écartée, mais AFFÛTÉE le même jour :
      un Signal par AXE, pas un par écran. Le plot laiton du rail est bien
      allumé sur toute page d'article (`SideNav.astro`,
      `current.startsWith("/blog/")`), et l'état du sommaire est EN LAITON LUI
      AUSSI. Les deux ne se disputent rien : le rail répond « où suis-je dans
      le SITE », le sommaire « où suis-je dans l'ARTICLE ». Deux questions,
      deux réponses, un seul accent — et l'arbre d'accessibilité les sépare
      pareil, `aria-current="page"` contre `"location"`. Ce que la règle
      interdit toujours, c'est deux marques laiton répondant à la MÊME
      question. La formulation complète est dans `DESIGN.md`, « The One Signal
      Rule ».

   2. « UN SCROLL-SPY OUVRIRAIT UN SECOND `IntersectionObserver` SUR
      `.prose h2` ». Toujours vrai, et c'est pourquoi il n'y en a pas. Cette
      fonction n'observe rien : elle se greffe sur l'écouteur `scroll` que
      `initReadingProgress` fait DÉJÀ tourner sur chaque article, et lit des
      ordonnées mises en cache. Le seul observateur de ce fichier reste celui
      des traces de section, qui est un verrou à un coup (`unobserve` dès la
      première intersection) et ne pouvait donc pas servir d'espion.

   LA LIGNE est à 30 % de la hauteur de fenêtre : au ras du haut, la section
   PRÉCÉDENTE resterait allumée pendant qu'on lit le nouveau titre. Le PLANCHER
   BAS n'est pas une coquetterie — sans lui, un dernier h2 suivi d'une queue
   plus courte que 70 % de la fenêtre ne franchit JAMAIS la ligne et ne
   s'allume jamais. C'est fonction de la hauteur de l'écran : vrai chez
   quelqu'un, faux chez vous.

   ZÉRO EN HAUT, MAINTENU EN BAS, et l'asymétrie est voulue. Au-dessus du
   premier h2 on n'est entré dans aucune section, et allumer la première
   pendant qu'on lit encore le h1 serait un mensonge dit à chaque chargement.
   Passé `</article>` — `ArticleSignoff` et `ReadNext` sont DEHORS — on les a
   toutes lues, et voir la marque s'éteindre juste en finissant se lit comme
   une panne.

   AUCUNE PIÈCE EN VOYAGE, contrairement au rail. Le trajet du rail est un
   geste de navigation, joué une fois par clic ; un espion se redéclenche sans
   fin, et un plot qui parcourt la marge droite pendant tout l'article, c'est
   l'échelle que la règle du bus de gauche existe pour éviter, arrivée par
   l'autre côté. Les transitions de 0,25 s déjà posées sur `::before` et
   `::after` suffisent.

   `aria-current="location"` et non `"page"` : le rail possède `"page"`
   (`SideNav.astro`). Deux axes, deux mots — et dans l'arbre d'accessibilité
   les deux marques portent alors des noms différents, ce qui est une seconde
   réponse, non visuelle, à la règle du Signal unique.

   `href="#slug"` EST UNE POIGNÉE, pas seulement un lien : c'est par lui que ce
   fichier retrouve le titre de chaque entrée. `TableOfContents.astro` le dit
   de son côté — le risque n'est pas qu'on l'ajoute, c'est qu'on le range.

   Sous `80rem` le sommaire est en `display:none` mais reste dans le DOM :
   d'où le `matchMedia`, sinon chaque téléphone paierait un calcul par
   défilement pour un élément que personne ne voit. Le seuil est celui de
   `TableOfContents.astro` et de `BUS_MQ` ci-dessus — les trois doivent rester
   d'accord.
--------------------------------------------------------------------------- */
type SommaireSpy = {
  measure: () => void;
  update: () => void;
  teardown: () => void;
};

let sommaireSpy: SommaireSpy | null = null;

/* 0,3 : la ligne de franchissement, en fraction de la hauteur de fenêtre. */
const LIGNE = 0.3;

function initSommaireSpy() {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('.sommaire a[href^="#"]'),
  ];
  if (!links.length) return;

  /* Les ids sont écrits BRUTS dans le HTML (« #le-métier-dans-cinq-ans »),
     donc `getAttribute` — et surtout pas `link.hash`, qui les rendrait
     pourcent-encodés et ne retrouverait plus rien. */
  const cibles: { link: HTMLAnchorElement; titre: HTMLElement }[] = [];
  for (const link of links) {
    const titre = document.getElementById(link.getAttribute("href")!.slice(1));
    if (titre) cibles.push({ link, titre });
  }
  if (!cibles.length) return;

  const mq = window.matchMedia(BUS_MQ);
  let ordonnees: number[] = [];
  let hauteurDoc = -1;
  let courant = -1;

  const measure = () => {
    hauteurDoc = document.documentElement.scrollHeight;
    ordonnees = cibles.map(
      ({ titre }) => titre.getBoundingClientRect().top + window.scrollY,
    );
  };

  /* On n'écrit QUE sur changement d'indice : un défilement continu devient
     alors une suite de non-opérations, et le DOM n'est touché qu'aux
     charnières. C'est ce qui rend inutile un étranglement par rAF. */
  const poser = (suivant: number) => {
    if (suivant === courant) return;
    const sortant = cibles[courant]?.link;
    if (sortant) {
      sortant.removeAttribute("data-active");
      sortant.removeAttribute("aria-current");
    }
    const entrant = cibles[suivant]?.link;
    if (entrant) {
      entrant.setAttribute("data-active", "");
      entrant.setAttribute("aria-current", "location");
    }
    courant = suivant;
  };

  const update = () => {
    if (!mq.matches) {
      poser(-1);
      return;
    }
    const doc = document.documentElement;
    /* LA MESURE SE RÉPARE TOUTE SEULE. Mesurer une fois à `astro:page-load` ne
       suffit pas : la mise en page n'est pas encore posée. Constaté sur
       `orchestration-ou-choregraphie`, où les DEUX premiers titres étaient
       cachés 21px trop bas — assez pour que la ligne se franchisse au mauvais
       moment, et arbitrairement plus sur un article à grande image.

       Le remède ne coûte NI écouteur NI observateur, ce qui est tout l'intérêt
       : `scrollHeight` est déjà lu à chaque défilement par la barre de
       progression, juste au-dessus dans le même gestionnaire, donc la
       comparaison est gratuite. Une page dont la hauteur bouge — polices,
       images, contenu tardif — se remesure au défilement suivant, quelle que
       soit la cause. `fonts.ready` couvre le seul cas que ce garde-fou rate :
       une refonte qui déplace les titres SANS changer la hauteur totale. */
    if (doc.scrollHeight !== hauteurDoc) measure();
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
      poser(cibles.length - 1);
      return;
    }
    const ligne = window.scrollY + window.innerHeight * LIGNE;
    let suivant = -1;
    for (let i = 0; i < ordonnees.length; i += 1) {
      if (ordonnees[i] > ligne) break;
      suivant = i;
    }
    poser(suivant);
  };

  /* Traverser le seuil change à la fois la géométrie (les bus s'allument, donc
     les traces changent de largeur) et la question elle-même. */
  const onChange = () => {
    measure();
    update();
  };
  mq.addEventListener("change", onChange);

  measure();
  update();
  document.fonts?.ready.then(() => {
    measure();
    update();
  });

  sommaireSpy = {
    measure,
    update,
    teardown: () => {
      mq.removeEventListener("change", onChange);
      sommaireSpy = null;
    },
  };

  document.addEventListener(
    "astro:before-swap",
    () => sommaireSpy?.teardown(),
    { once: true },
  );
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
      /* Le même instant : la colonne a changé de largeur, donc les titres ont
         changé d'ordonnée. Le sommaire se remesure ici plutôt que sur un
         second écouteur `resize` — celui-ci est déjà débattu à 150 ms. */
      sommaireSpy?.measure();
      sommaireSpy?.update();
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
    /* L'ESPION DU SOMMAIRE ROULE ICI, et c'est tout le marché : cet écouteur
       `scroll` tournait DÉJÀ sur chaque article, pour la barre. Le sommaire
       suit donc la lecture sans qu'aucun observateur ni aucun écouteur ne
       s'ajoute à la page — la seule objection du revirement qui restait
       vraie est ainsi honorée, et non contournée. */
    sommaireSpy?.update();
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
/* AVANT `initReadingProgress` : celle-ci appelle son `update()` de façon
   synchrone à l'init, et cet `update()` pilote désormais l'espion. */
document.addEventListener("astro:page-load", initSommaireSpy);
document.addEventListener("astro:page-load", initReadingProgress);
