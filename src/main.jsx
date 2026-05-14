import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

const rootEl = document.getElementById("root");
const tree = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <App />
    </BrowserRouter>
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
//
// Consent gating (see src/components/CookieConsent + src/lib/consent.js):
//
//   Always loaded — operational / cookieless:
//     Toaster, Sentry (error monitoring), BotID (spam shield on POST routes)
//
//   Loaded only after explicit Accept (the LinkedIn tag sets third-party
//   cookies; RB2B identifies the visitor person-to-person):
//     LinkedIn Insight Tag, RB2B
//
// On first visit the Accept handler in CookieConsent dispatches
// `pcc:consent` with detail "accepted", which whenAccepted() listens for
// and fires the deferred trackers — no page reload required.
if (!navigator.webdriver) {
  const loadExtras = async () => {
    try {
      const [
        { createElement },
        { Toaster },
        { initBotId },
        { initLinkedInInsightTag, initRb2b },
        { initSentryClient },
        { whenAccepted },
      ] = await Promise.all([
        import("react"),
        import("@/components/ui/sonner"),
        import("botid/client/core"),
        import("@/lib/observers"),
        import("@/lib/sentry.client"),
        import("@/lib/consent"),
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
      initSentryClient();
      // Gated on explicit consent — fires now if already accepted, or
      // hooks the next `pcc:consent` event otherwise.
      whenAccepted(() => {
        initLinkedInInsightTag(import.meta.env.VITE_LINKEDIN_PARTNER_ID);
        initRb2b(import.meta.env.VITE_RB2B_TEAM_ID);
      });
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
