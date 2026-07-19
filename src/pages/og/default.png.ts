import type { APIRoute } from "astro";
import { renderOgCard } from "../../lib/og-card";

export const GET: APIRoute = async () => {
  const png = await renderOgCard({
    title: "William Leemans",
    metaRight: "Architecte logiciel · Lille",
  });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
