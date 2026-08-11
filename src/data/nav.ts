/**
 * The site's primary navigation, shared by both layouts.
 *
 * This used to be declared twice — identically — in Layout.astro and
 * BlogLayout.astro, which meant every nav change was two edits that had to
 * agree. One source now.
 *
 * "Now" and "Talks" are the two deliberate English labels; see CLAUDE.md.
 *
 * « Now » n'est glosé nulle part dans le rail, et c'est assumé : réexaminé le
 * 2026-08-11 après une critique notant qu'un primo-visiteur clique sans savoir
 * ce qu'il y trouvera. Les trois issues coûtaient plus qu'elles ne rendaient —
 * `title` ne s'affiche pas au tactile et ne s'annonce pas de façon fiable (le
 * commentaire de SideNav.astro le dit déjà), un `aria-label` écraserait le
 * libellé visible, et un sous-titre visible ajouterait du texte à un rail tenu
 * volontairement à quatre mots. La page d'arrivée se glose elle-même dès sa
 * première phrase (« Ce qu'il se passe dans ma vie en ce moment, inspiré par
 * nownownow.com ») : le coût réel est un clic, immédiatement payé. À rouvrir
 * si cette phrase disparaît de /now.
 */
export type NavItem = {
  label: string;
  href: string;
};

export const nav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Talks", href: "/talks" },
  { label: "Now", href: "/now" },
];
