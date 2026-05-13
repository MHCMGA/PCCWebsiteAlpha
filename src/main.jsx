import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

const rootEl = document.getElementById("root");
const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter
        basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
      >
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Prerendered routes (see scripts/prerender.mjs) ship rendered HTML - hydrate
// to attach event handlers without a re-paint. SPA fallback routes get the
// empty shell, so createRoot for those.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, tree);
} else {
  createRoot(rootEl).render(tree);
}

// Defer all client-only extras (toaster, analytics, bot detection) until after
// hydration + idle. Skip during prerender (puppeteer sets navigator.webdriver)
// so they never appear in the prerendered HTML payload.
if (!navigator.webdriver) {
  const loadExtras = async () => {
    try {
      const [
        { createElement },
        { Toaster },
        { initBotId },
        { initClarity, initLinkedInInsightTag, initRb2b },
        { initSentryClient },
      ] = await Promise.all([
        import("react"),
        import("@/components/ui/sonner"),
        import("botid/client/core"),
        import("@/lib/observers"),
        import("@/lib/sentry.client"),
      ]);
      // Vercel Analytics + Speed Insights moved into App's router tree
      // (src/lib/VercelInsights.jsx) so per-route attribution works.
      const host = document.createElement("div");
      host.id = "extras-root";
      document.body.appendChild(host);
      createRoot(host).render(createElement(Toaster));
      initBotId({
        protect: [
          { path: "/api/contact", method: "POST" },
          { path: "/api/ask", method: "POST" },
        ],
      });
      // Clarity Project IDs are not secrets — they ship in the loaded script
      // for every visitor. Hardcode as the default; allow env override (set
      // VITE_CLARITY_PROJECT_ID to a different value, or to '' to disable).
      const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID ?? "wmnzkdq7pj";
      initClarity(clarityId);
      initLinkedInInsightTag(import.meta.env.VITE_LINKEDIN_PARTNER_ID);
      initRb2b(import.meta.env.VITE_RB2B_TEAM_ID);
      initSentryClient();
    } catch (err) {
      console.warn("[extras] failed to load", err);
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadExtras, { timeout: 2000 });
  } else {
    setTimeout(loadExtras, 1500);
  }
}
