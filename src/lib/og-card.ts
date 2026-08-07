import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Satori renders outside the document, so it can't read the CSS custom
// properties — the tokens come from palette.ts.
import { BRASS, FADED, PAGE_DARK, PRIMARY_100 } from "./palette";

// Template C « framed plate » (issue #9): dark plate over a faint dot grid,
// HomeDecoration-style dashed trace across the top, big left-aligned title,
// hairline-ruled meta strip along the bottom.

const WIDTH = 1200;
const HEIGHT = 630;

const font = (pkgPath: string) =>
  fs.readFileSync(path.join(process.cwd(), "node_modules", pkgPath));

const spaceGrotesk = font(
  "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff",
);
const plexMono = font(
  "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff",
);

// Full-bleed dashed trace with one arc, ticks and a via drop — SVG keeps the
// arc geometry satori's div model can't express.
const traceSvg = `<svg width="1200" height="140" viewBox="0 0 1200 140" xmlns="http://www.w3.org/2000/svg">
  <g stroke="${PRIMARY_100}" stroke-opacity="0.3" fill="none">
    <path d="M 0 78 L 820 78" stroke-width="1.5" stroke-dasharray="5 10"/>
    <path d="M 820 78 A 30 30 0 0 0 880 78" stroke-width="1.5"/>
    <path d="M 880 78 L 1200 78" stroke-width="1.5" stroke-dasharray="5 10"/>
    <path d="M 80 71 L 80 85" stroke-width="1.2"/>
    <path d="M 1120 71 L 1120 85" stroke-width="1.2"/>
    <path d="M 300 78 L 300 108" stroke-width="1.2"/>
  </g>
  <g fill="${PRIMARY_100}" fill-opacity="0.3">
    <circle cx="820" cy="78" r="3"/>
    <circle cx="880" cy="78" r="3"/>
    <circle cx="850" cy="48" r="2.5"/>
    <circle cx="300" cy="78" r="2.5"/>
    <circle cx="300" cy="108" r="2.5"/>
    <circle cx="80" cy="78" r="2.5"/>
    <circle cx="1120" cy="78" r="2.5"/>
  </g>
</svg>`;

const traceDataUri = `data:image/svg+xml;base64,${Buffer.from(traceSvg).toString("base64")}`;

type OgCardOptions = {
  title: string;
  /** Circuit labels for the bottom-right of the meta strip, e.g. "2026·07 · T:06". */
  metaRight?: string;
};

export async function renderOgCard({
  title,
  metaRight,
}: OgCardOptions): Promise<Uint8Array<ArrayBuffer>> {
  const fontSize = title.length > 32 ? 60 : 74;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          position: "relative",
          backgroundColor: PAGE_DARK,
          backgroundImage: `radial-gradient(circle, rgba(250, 250, 250, 0.08) 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
          fontFamily: "IBM Plex Mono",
        },
        children: [
          {
            type: "img",
            props: {
              src: traceDataUri,
              width: 1200,
              height: 140,
              style: { position: "absolute", top: 0, left: 0 },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 82,
                top: 196,
                width: 96,
                height: 3,
                backgroundColor: BRASS,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 80,
                top: 232,
                width: 1040,
                display: "flex",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize,
                lineHeight: 1.18,
                letterSpacing: 1,
                color: PRIMARY_100,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 80,
                top: 508,
                width: 1040,
                height: 1,
                backgroundColor: "rgba(250, 250, 250, 0.3)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 80,
                top: 502,
                width: 1.2,
                height: 12,
                backgroundColor: "rgba(250, 250, 250, 0.3)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 1119,
                top: 502,
                width: 1.2,
                height: 12,
                backgroundColor: "rgba(250, 250, 250, 0.3)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 80,
                top: 538,
                display: "flex",
                alignItems: "baseline",
                fontSize: 23,
                color: "rgba(250, 250, 250, 0.85)",
              },
              children: [
                { type: "span", props: { children: "William Leemans" } },
                {
                  type: "span",
                  props: {
                    style: { color: FADED, margin: "0 12px" },
                    children: "·",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { color: BRASS, letterSpacing: 2 },
                    children: "lmns.fr",
                  },
                },
              ],
            },
          },
          ...(metaRight
            ? [
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      right: 80,
                      top: 538,
                      display: "flex",
                      fontSize: 23,
                      letterSpacing: 2,
                      color: FADED,
                    },
                    children: metaRight,
                  },
                },
              ]
            : []),
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Space Grotesk",
          data: spaceGrotesk,
          weight: 700,
          style: "normal",
        },
        { name: "IBM Plex Mono", data: plexMono, weight: 400, style: "normal" },
      ],
    },
  );

  // Copied into a plain Uint8Array: resvg hands back a Node Buffer, which is a
  // view into a shared pool and isn't a valid `BodyInit` for the Response the
  // OG endpoints return.
  return Uint8Array.from(new Resvg(svg).render().asPng());
}
