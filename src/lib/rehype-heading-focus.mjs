/**
 * Rendre h2/h3 focalisables, pour qu'un saut d'ancre déplace le FOCUS et pas
 * seulement la vue.
 *
 * Safari est la raison d'être de ce greffon, et la panne est déjà consignée
 * dans `SkipLink.astro` : sans `tabindex="-1"` sur la cible, il défile jusqu'à
 * l'ancre mais laisse le focus en haut de page — la tabulation suivante
 * repart de l'en-tête. Le `<main tabindex="-1">` des layouts règle le cas du
 * lien d'évitement ; les liens du sommaire ont besoin de la même chose sur
 * chaque titre qu'ils visent.
 *
 * `-1` et jamais `0` : les titres doivent être FOCALISABLES, pas TABULABLES.
 * Un `0` ajouterait un arrêt clavier par titre à chaque article, et
 * `scripts/guard/a11y.mjs` aurait raison de le relever — il signale tout
 * `tabindex > 0`, et une valeur positive casserait aussi l'assertion « lien
 * d'évitement premier au clavier » qu'il pose juste à côté.
 *
 * Appliqué à toute la chaîne markdown plutôt qu'au seul blog : les titres
 * d'une entrée Now n'y perdent rien, et restreindre la portée obligerait ce
 * greffon à savoir dans quelle collection il tourne — ce qu'il ne peut pas, et
 * qui serait un ajout plus lourd qu'un attribut inerte.
 *
 * h2 et h3 seulement, comme ce que le sommaire indexe. Le h1 est le titre de
 * la page et rien ne pointe dessus.
 */
const CIBLES = new Set(["h2", "h3"]);

export default function rehypeHeadingFocus() {
  /** @param {{ children?: any[] }} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if (CIBLES.has(child.tagName)) {
          child.properties = child.properties ?? {};
          // Nom hast : `tabIndex` est sérialisé en `tabindex`.
          child.properties.tabIndex = -1;
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
