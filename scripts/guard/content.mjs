// Assertion sur le contenu — la quatrième famille.
//
// Elle existe parce que les trois autres ne la voient pas : axe-core n'a
// aucune règle qui matche `time` ou `datetime` sur ses 105 règles, html-validate
// non plus, et aucun outil n'a de notion de « cette chaîne aurait dû être
// rendue en fr-FR ». Les deux défauts que l'issue #20 a laissés au contrat
// (un `<time>` sans `datetime`, une date dans la locale du runner) tombaient
// exactement dans ce trou.
//
// Le pendant de ce fichier vit dans `src/content.config.ts` : un `pubDate`
// malformé y casse le build. La frontière est là — une DONNÉE malformée
// bloque, un CONSTAT de rendu informe.

// Ce que le site émet, et rien d'autre : 2026, 2026-01, 2026-01-20.
const ISO = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/;

const MOIS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const MOIS_EN = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const bornes = (iso) => {
  const m = ISO.exec(iso);
  if (!m) return null;
  const [, year, month, day] = m;
  if (month && (+month < 1 || +month > 12)) return null;
  if (day) {
    // Passe par UTC pour ne pas dépendre de la zone de la machine qui vérifie.
    const d = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.getUTCDate() !== +day) return null;
  }
  return { year: +year, month: month ? +month : null };
};

export function run(pages) {
  const findings = [];

  for (const { page, document } of pages) {
    for (const el of document.querySelectorAll("time")) {
      const iso = el.getAttribute("datetime");
      const texte = el.textContent.trim();
      const où = texte ? `« ${texte} »` : "<time> vide";

      if (!iso) {
        findings.push({
          page,
          rule: "time-datetime-manquant",
          detail: `${où} sans attribut datetime`,
        });
        continue;
      }

      const attendu = bornes(iso);
      if (!attendu) {
        findings.push({
          page,
          rule: "time-datetime-invalide",
          detail: `datetime="${iso}" n'est pas une date ISO du site`,
        });
        continue;
      }

      const bas = texte.toLowerCase();

      // Aucun mois anglais ne s'écrit comme son homologue français (« may » /
      // « mai », « march » / « mars »), donc la détection est sans ambiguïté.
      const anglais = MOIS_EN.filter((mois) =>
        new RegExp(`\\b${mois}\\b`).test(bas),
      );
      if (anglais.length > 0) {
        findings.push({
          page,
          rule: "time-locale",
          detail: `${où} contient « ${anglais[0]} » — rendu hors fr-FR`,
        });
        continue;
      }

      const moisRendu = MOIS_FR.findIndex((mois) =>
        new RegExp(`\\b${mois}\\b`).test(bas),
      );
      if (moisRendu >= 0 && attendu.month && moisRendu + 1 !== attendu.month) {
        findings.push({
          page,
          rule: "time-mois-divergent",
          detail: `${où} contre datetime="${iso}"`,
        });
        continue;
      }

      const anRendu = texte.match(/\b(\d{4})\b/);
      if (anRendu && +anRendu[1] !== attendu.year) {
        findings.push({
          page,
          rule: "time-annee-divergente",
          detail: `${où} contre datetime="${iso}"`,
        });
      }
    }
  }

  return {
    name: "contenu",
    findings,
    summary: `${findings.length} constat(s) / ${pages.length} pages`,
  };
}
