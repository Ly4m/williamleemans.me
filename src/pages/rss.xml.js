import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate)
  );

  return rss({
    title: 'William Leemans | Blog',
    description: "Le site personnel de William Leemans",
    site: context.site,
    trailingSlash: false,
    stylesheet: '/rss.xsl',
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.data.slug}`,
    })),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom"
    },
    customData: `
      <language>fr-fr</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro</generator>
      <managingEditor>william@leemans.me (William Leemans)</managingEditor>
      <copyright>Copyright © 2025 William Leemans</copyright>
      <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
    `,
  });
}