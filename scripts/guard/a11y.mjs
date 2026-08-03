// Accessibilité : axe-core exécuté dans jsdom, plus les invariants du lien
// d'évitement qu'aucune règle sur étagère ne relève.
//
// Pourquoi jsdom et pas un navigateur : sous jsdom la règle `color-contrast`
// ne peut PAS s'exécuter (jsdom rend `canvas.getContext()` null), donc axe la
// range dans `incomplete` et jamais dans `violations`. C'est délibéré, et
// c'est l'argument qui a écarté le navigateur : la palette de ce site est
// arbitrée à la main (--color-brass-ink sur #fafafa, le rail de nav à 4,3:1),
// et un vrai Chrome remonte 342 constats de contraste en clair, dont 243 sont
// les couleurs de Shiki que CLAUDE.md place hors du système. Un garde-fou dont
// le verdict est « vos décisions sont des défauts » est un garde-fou qu'on
// désactive. Ici il n'y a rien à désactiver : la règle est hors d'atteinte.
//
// Deux autres règles tombent de la même manière (`landmark-one-main` et
// `page-has-heading-one`, via `document.elementFromPoint`). La première est
// reprise à la main ci-dessous, en plus strict.

import { readFileSync } from "node:fs";

const AXE_SOURCE = readFileSync(
  new URL("../../node_modules/axe-core/axe.min.js", import.meta.url),
  "utf8",
);

// Ce qui rend le lien d'évitement réel. Les trois faits viennent de l'issue
// #21 : chacun peut se défaire « en rangeant » sans que `astro check` ni le
// build ne bronchent.
const SKIP_TARGET = "contenu";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function invariants(document, page) {
  const findings = [];
  const mains = document.querySelectorAll("main");

  if (mains.length !== 1) {
    findings.push({
      page,
      rule: "main-unique",
      detail: `${mains.length} élément(s) <main> (attendu 1)`,
    });
  }

  const main = mains[0];
  if (main) {
    if (main.id !== SKIP_TARGET) {
      findings.push({
        page,
        rule: "main-id",
        detail: `<main id="${main.id}"> (attendu "${SKIP_TARGET}")`,
      });
    }
    // Sans lui, sous Safari, le focus ne suit pas le saut.
    if (main.getAttribute("tabindex") !== "-1") {
      findings.push({
        page,
        rule: "main-tabindex",
        detail: `<main> sans tabindex="-1"`,
      });
    }
  }

  // Un tabindex positif réordonne la tabulation et rendrait l'assertion
  // suivante mensongère : « premier dans le document » ne vaut « premier au
  // clavier » que si personne ne joue avec l'ordre.
  const positive = [...document.querySelectorAll("[tabindex]")].filter(
    (el) => Number(el.getAttribute("tabindex")) > 0,
  );
  if (positive.length > 0) {
    findings.push({
      page,
      rule: "tabindex-positif",
      detail: `${positive.length} élément(s) avec tabindex > 0`,
    });
  }

  const first = document.body.querySelector(FOCUSABLE);
  if (!first || first.getAttribute("href") !== `#${SKIP_TARGET}`) {
    findings.push({
      page,
      rule: "lien-evitement-premier",
      detail: first
        ? `premier arrêt clavier : <${first.tagName.toLowerCase()}> ${
            first.getAttribute("href") ?? ""
          }`.trim()
        : "aucun élément focalisable",
    });
  }

  return findings;
}

export async function run(pages) {
  const findings = [];

  for (const { page, window, document } of pages) {
    window.eval(AXE_SOURCE);

    // `resultTypes: ["violations"]` n'écarte pas `incomplete`, il en allège le
    // détail. C'est bien ce qu'on veut : les règles qui plantent sous jsdom
    // (color-contrast, landmark-one-main, page-has-heading-one) y atterrissent
    // et ne sont jamais lues. Une règle en échec ne peut donc pas devenir un
    // constat par accident — comportement documenté par Deque, pas une chance.
    const results = await window.axe.run(document, {
      resultTypes: ["violations"],
    });

    for (const violation of results.violations) {
      findings.push({
        page,
        rule: violation.id,
        detail: `${violation.nodes.length} nœud(s) — ${violation.help}`,
      });
    }

    findings.push(...invariants(document, page));
  }

  return {
    name: "a11y",
    findings,
    summary: `${findings.length} constat(s) / ${pages.length} pages`,
  };
}
