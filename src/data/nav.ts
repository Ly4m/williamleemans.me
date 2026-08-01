/**
 * The site's primary navigation, shared by both layouts.
 *
 * This used to be declared twice — identically — in Layout.astro and
 * BlogLayout.astro, which meant every nav change was two edits that had to
 * agree. One source now.
 *
 * "Now" and "Talks" are the two deliberate English labels; see CLAUDE.md.
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
