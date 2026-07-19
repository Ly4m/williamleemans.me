import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { renderOgCard } from "../../../lib/og-card";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post: CollectionEntry<"blog">) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as CollectionEntry<"blog">;

  const date = post.data.pubDate;
  const dateLabel = `${date.getFullYear()}·${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  const readingTime = `T:${String(post.data.readingTime).padStart(2, "0")}`;

  const png = await renderOgCard({
    title: post.data.title,
    metaRight: `${dateLabel} · ${readingTime}`,
  });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
