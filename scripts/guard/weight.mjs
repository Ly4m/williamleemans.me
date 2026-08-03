// Budget de poids — la coquille, jamais les images.
//
// 6,1 Mo des 7,7 Mo de `dist/` sont des pochettes et des SVG de décoration, et
// CLAUDE.md dit que la fioriture gagne par défaut. Un budget sur le total
// serait donc une machine qui se dispute avec les valeurs du site à chaque
// entrée Now — et qui perdrait, en se faisant supprimer. Ce qui se borne
// utilement, c'est ce qu'un lecteur paie AVANT la moindre image : le HTML de
// la page, plus le CSS et le JS qu'elle référence.
//
// Les polices ne sont pas bornées en octets, et c'est mesuré, pas timide :
// @fontsource émet 62 fichiers (cyrillique, grec, vietnamien compris) dont
// `unicode-range` garantit qu'une page française n'en tirera jamais que deux
// ou trois. Un analyseur statique ne peut pas savoir lesquels. Ce qui se
// compte, c'est le nombre de FAMILLES : une troisième police est la régression
// qui vaut d'être vue, pas un octet.

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const KIB = 1024;

// Mesuré sur `dist/` au 2026-08-02 : max 12,2 / 12,1 / 5,6 KiB. Environ 60 %
// de marge — de quoi écrire un long article, pas de quoi qu'un framework
// client se glisse dedans sans qu'on le remarque.
export const PLAFONDS = { html: 20, css: 20, js: 12 };
export const FAMILLES_ATTENDUES = 2;

const gz = (buf) => gzipSync(buf, { level: 9 }).length / KIB;

const local = (url) =>
  url && !/^(https?:)?\/\//.test(url) && !url.startsWith("data:");

function tailleActif(dist, url, cache) {
  const chemin = join(dist, url.split("?")[0].replace(/^\//, ""));
  if (cache.has(chemin)) return cache.get(chemin);
  let taille = 0;
  try {
    if (statSync(chemin).isFile()) taille = gz(readFileSync(chemin));
  } catch {
    // Un actif introuvable n'est pas l'affaire de ce script : c'est un lien
    // mort, et lychee le dit mieux.
  }
  cache.set(chemin, taille);
  return taille;
}

function familles(dist, feuilles, cache) {
  const noms = new Set();
  for (const href of feuilles) {
    const chemin = join(dist, href.split("?")[0].replace(/^\//, ""));
    let css = cache.get(chemin);
    if (css === undefined) {
      try {
        css = readFileSync(chemin, "utf8");
      } catch {
        css = "";
      }
      cache.set(chemin, css);
    }
    for (const bloc of css.match(/@font-face\s*\{[^}]*\}/g) ?? []) {
      const nom = bloc.match(/font-family\s*:\s*(['"]?)([^;'"]+)\1/);
      if (nom) noms.add(nom[2].trim());
    }
  }
  return noms;
}

export function run(pages, dist) {
  const findings = [];
  const cacheActifs = new Map();
  const cacheCss = new Map();
  const noms = new Set();
  const lignes = [];

  for (const { page, html, document } of pages) {
    const feuilles = [
      ...new Set(
        [...document.querySelectorAll("link[rel~=stylesheet][href]")]
          .map((el) => el.getAttribute("href"))
          .filter(local),
      ),
    ];
    const scripts = [
      ...new Set(
        [...document.querySelectorAll("script[src]")]
          .map((el) => el.getAttribute("src"))
          .filter(local),
      ),
    ];

    const mesures = {
      html: gz(Buffer.from(html)),
      css: feuilles.reduce((n, u) => n + tailleActif(dist, u, cacheActifs), 0),
      js: scripts.reduce((n, u) => n + tailleActif(dist, u, cacheActifs), 0),
    };

    for (const [famille, plafond] of Object.entries(PLAFONDS)) {
      if (mesures[famille] > plafond) {
        findings.push({
          page,
          rule: `poids-${famille}`,
          detail: `${mesures[famille].toFixed(1)} KiB gzip (plafond ${plafond})`,
        });
      }
    }

    for (const nom of familles(dist, feuilles, cacheCss)) noms.add(nom);
    lignes.push({ page, ...mesures });
  }

  if (noms.size !== FAMILLES_ATTENDUES) {
    findings.push({
      page: "—",
      rule: "polices-familles",
      detail: `${noms.size} famille(s) (attendu ${FAMILLES_ATTENDUES}) : ${[...noms].join(", ")}`,
    });
  }

  lignes.sort((a, b) => b.html + b.css + b.js - (a.html + a.css + a.js));

  return {
    name: "poids",
    findings,
    lignes,
    familles: noms,
    summary:
      findings.length === 0
        ? `sous les plafonds ${PLAFONDS.html}/${PLAFONDS.css}/${PLAFONDS.js} KiB, ${noms.size} familles de polices`
        : `${findings.length} dépassement(s)`,
  };
}
