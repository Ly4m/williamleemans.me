/**
 * Copies the page colour into <meta name="theme-color">, so the mobile browser
 * bar matches the page underneath it.
 *
 * The site's theme is a class on <html> backed by localStorage, not
 * prefers-color-scheme, so the usual pair of media-query <meta> tags would
 * ignore the toggle entirely — a visitor on a light OS who switches the site to
 * dark would get a white bar above a charcoal page. The colour therefore has to
 * be pushed from the code that owns the theme: applyTheme() in both layouts on
 * load and after a view transition, and toggleTheme() in SideNav on click.
 *
 * The layouts can't import this — their theme script is `is:inline` so it can
 * run before the first paint — and they carry an inlined copy. Keep the three
 * in step; the value itself is read from --color-page, so only this logic is
 * duplicated, never the colour.
 */
export function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  const page = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-page")
    .trim();

  if (page) meta.setAttribute("content", page);
}
