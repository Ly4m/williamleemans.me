#!/usr/bin/env node
// Le garde-fou : trois familles de constats sur le `dist/` que `pnpm build`
// vient de produire. La quatrième — les liens — est tenue par lychee, qui n'a
// pas besoin de Node.
//
// LE RÉGIME, ET IL EST DÉLIBÉRÉ : ce script INFORME, il ne bloque pas. Il sort
// 0 même couvert de constats ; le rapport va sur la PR, là où se trouve le
// bouton Merge, et c'est un humain qui décide. Il ne sort non-zéro que s'il ne
// peut pas tourner (pas de `dist/`, plantage) — un garde-fou cassé doit se
// voir, un constat non.
//
// Ce qui bloque vraiment vit ailleurs : `pnpm build` échoue sur un `pubDate`
// malformé (voir `src/content.config.ts`). Une DONNÉE malformée bloque, un
// CONSTAT de rendu informe.
//
// Usage : node scripts/guard.mjs [dist] [> rapport.md]

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

import { JSDOM, VirtualConsole } from "jsdom";

import { run as a11y } from "./guard/a11y.mjs";
import { run as contenu } from "./guard/content.mjs";
import { PLAFONDS, run as poids } from "./guard/weight.mjs";

const DIST = process.argv[2] ?? "dist";

async function fichiersHtml(racine) {
  const trouvés = [];
  for (const entrée of await readdir(racine, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (entrée.isFile() && entrée.name.endsWith(".html")) {
      trouvés.push(join(entrée.parentPath, entrée.name));
    }
  }
  return trouvés.sort();
}

// `dist/blog/flux-rss/index.html` → `/blog/flux-rss/`, `dist/404.html` → `/404.html`.
const url = (chemin) => {
  const rel = relative(DIST, chemin).split(sep).join("/");
  return rel.endsWith("index.html") ? `/${rel.slice(0, -10)}` : `/${rel}`;
};

// Les liens sont tenus par lychee, hors de Node. La CI le lance avant ce
// script et lui passe le code de sortie, pour que le rapport ait une seule
// forme et un seul auteur. Absent en local, la ligne disparaît plutôt que de
// mentir.
const ligneLiens = () => {
  const code = process.env.GUARD_LIENS;
  if (code === undefined) return [];
  return [
    code === "0"
      ? "| ✅ liens | aucun lien interne cassé |"
      : `| ⚠️ liens | lychee sort ${code} — voir le détail plus bas |`,
  ];
};

const tableau = (résultats) =>
  [
    "| famille | constat |",
    "| --- | --- |",
    ...résultats.map(
      (r) =>
        `| ${r.findings.length === 0 ? "✅" : "⚠️"} ${r.name} | ${r.summary} |`,
    ),
    ...ligneLiens(),
  ].join("\n");

const détail = (résultats) => {
  const avec = résultats.filter((r) => r.findings.length > 0);
  if (avec.length === 0) return "";
  return [
    "",
    "| page | règle | détail |",
    "| --- | --- | --- |",
    ...avec.flatMap((r) =>
      r.findings.map((f) => `| \`${f.page}\` | \`${f.rule}\` | ${f.detail} |`),
    ),
  ].join("\n");
};

const tableauPoids = ({ lignes }) =>
  [
    "",
    "<details><summary>Poids par page (KiB gzip)</summary>",
    "",
    `| page | html / ${PLAFONDS.html} | css / ${PLAFONDS.css} | js / ${PLAFONDS.js} |`,
    "| --- | --- | --- | --- |",
    ...lignes.map(
      (l) =>
        `| \`${l.page}\` | ${l.html.toFixed(1)} | ${l.css.toFixed(1)} | ${l.js.toFixed(1)} |`,
    ),
    "",
    "</details>",
  ].join("\n");

const chemins = await fichiersHtml(DIST);
if (chemins.length === 0) {
  console.error(
    `guard: aucun HTML sous ${DIST}/ — lancer \`pnpm build\` d'abord`,
  );
  process.exit(1);
}

const pages = chemins.map((chemin) => {
  const html = readFileSync(chemin, "utf8");
  // Un seul parse, partagé par les trois familles. `outside-only` laisse
  // `window.eval` disponible pour injecter axe sans exécuter les scripts de la
  // page — on vérifie le HTML livré, pas le site hydraté.
  const { window } = new JSDOM(html, {
    runScripts: "outside-only",
    // Muet volontairement : jsdom crie « HTMLCanvasElement's getContext() not
    // implemented » une fois par page, et c'est précisément le mécanisme qui
    // rend `color-contrast` inexécutable. Ce n'est pas une panne à afficher,
    // c'est le garde-fou qui fonctionne comme prévu.
    virtualConsole: new VirtualConsole(),
  });
  return { page: url(chemin), html, window, document: window.document };
});

const résultats = [await a11y(pages), contenu(pages), poids(pages, DIST)];

for (const { window } of pages) window.close();

const total = résultats.reduce((n, r) => n + r.findings.length, 0);
const liensKO = ![undefined, "0"].includes(process.env.GUARD_LIENS);

const verdict =
  [total > 0 && `${total} constat(s)`, liensKO && "des liens cassés"]
    .filter(Boolean)
    .join(", ") || "aucun constat";

console.log(
  [
    `**${chemins.length} pages** — ${verdict}.`,
    "",
    tableau(résultats),
    détail(résultats),
    tableauPoids(résultats.find((r) => r.name === "poids")),
  ].join("\n"),
);
