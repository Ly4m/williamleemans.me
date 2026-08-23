import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate),
  );

  // The feed started in 2025; the span's end tracks the build year, the same
  // way lastBuildDate below tracks the build itself.
  const year = new Date().getFullYear();
  const copyrightSpan = year > 2025 ? `2025–${year}` : "2025";

  return rss({
    title: "William Leemans | Blog",
    description: "Le site personnel de William Leemans",
    site: context.site,
    // Le site est bâti au format `directory` : `/blog/<slug>/` est l'adresse
    // réelle du fichier, celle du `<link rel="canonical">` et du sitemap.
    trailingSlash: true,
    stylesheet: "/rss.xsl",
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.data.slug}`,
    })),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `
      <language>fr-fr</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro</generator>
      <managingEditor>william@lmns.fr (William Leemans)</managingEditor>
      <copyright>Copyright © ${copyrightSpan} William Leemans</copyright>
      <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
    `,
  });
}
