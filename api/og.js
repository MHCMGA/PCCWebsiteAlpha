// Dynamic Open Graph image generation.
// Returns a 1200x630 PNG branded for PCC. Cached on the edge for 1 day.
// Use ?title=...&eyebrow=... to customize per page.

import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const NAVY = "#003057";
const TEAL = "#006fa8";
const CYAN = "#27b6fd";

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const eyebrow = (searchParams.get("eyebrow") || "Palmetto Consulting of Columbia").slice(0, 80);
  const title = (searchParams.get("title") || "Independent Captive Insurance Consultants").slice(
    0,
    140,
  );
  const tagline = (searchParams.get("tagline") || "Columbia, SC · Since 1998").slice(0, 80);

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "16px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "12px",
                      height: "48px",
                      background: CYAN,
                      borderRadius: "2px",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: CYAN,
                    },
                    children: eyebrow,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                fontSize: "28px",
                color: "#cbd5e1",
              },
              children: [
                { type: "div", props: { children: tagline } },
                {
                  type: "div",
                  props: {
                    style: { color: CYAN, fontWeight: 600 },
                    children: "palmettoconsulting.us",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Vercel-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
