// Weekly cron job: ping search engines so they re-fetch our sitemap.
// Wired in vercel.json under "crons". Vercel sends a GET with a Bearer
// header equal to CRON_SECRET when set.

const SITEMAP = "https://palmettoconsulting.us/sitemap.xml";

const PING_TARGETS = [
  // Google deprecated its public sitemap-ping endpoint (2023). IndexNow is the
  // modern equivalent for non-Google engines (Bing, Yandex, Seznam).
  { name: "bing-indexnow", url: "https://www.bing.com/indexnow" },
  { name: "yandex-indexnow", url: "https://yandex.com/indexnow" },
];

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }

  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    return res.status(200).json({
      ok: false,
      reason: "INDEXNOW_KEY env not set; skipping pings",
      sitemap: SITEMAP,
    });
  }

  const results = await Promise.all(
    PING_TARGETS.map(async (t) => {
      try {
        const r = await fetch(t.url, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: "palmettoconsulting.us",
            key: indexNowKey,
            urlList: [SITEMAP],
          }),
        });
        return { target: t.name, status: r.status };
      } catch (err) {
        return { target: t.name, error: String(err).slice(0, 200) };
      }
    }),
  );

  return res.status(200).json({ ok: true, sitemap: SITEMAP, results });
}
