import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// Lives inside <BrowserRouter> so it can read the current route. Lazy-loads
// the Vercel analytics packages on idle so they stay out of the initial
// bundle, then passes a stable `route` prop on every navigation so per-route
// RES (Real Experience Score) can compute correctly.
//
// Speed Insights 2.x reports the full Core Web Vitals set (LCP, INP, CLS,
// FCP, TTFB) automatically — INP coverage is live in Vercel's dashboard
// per-route. Third-party scripts that could inflate INP (botid, sentry,
// linkedin, rb2b) are deferred via requestIdleCallback in main.jsx.
export default function VercelInsights() {
  const location = useLocation();
  const params = useParams();
  const [mods, setMods] = useState(null);

  const route = useMemo(() => {
    if (!Object.keys(params).length) return location.pathname;
    return Object.entries(params).reduce(
      (path, [key, value]) => path.replace(value, `:${key}`),
      location.pathname,
    );
  }, [location.pathname, params]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    let cancelled = false;
    const load = async () => {
      try {
        const [{ Analytics }, { SpeedInsights }] = await Promise.all([
          import("@vercel/analytics/react"),
          import("@vercel/speed-insights/react"),
        ]);
        if (!cancelled) setMods({ Analytics, SpeedInsights });
      } catch (err) {
        console.warn("[vercel-insights] failed to load", err);
      }
    };
    const idleId =
      "requestIdleCallback" in window
        ? requestIdleCallback(load, { timeout: 2000 })
        : setTimeout(load, 1500);
    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  if (!mods) return null;
  const { Analytics, SpeedInsights } = mods;
  return (
    <>
      <Analytics route={route} />
      <SpeedInsights route={route} />
    </>
  );
}
