// Third-party visibility scripts: LinkedIn Insight Tag (company / job-title
// visitor identification) and RB2B (person-level visitor de-anonymization).
//
// Both follow the same lazy/idle pattern as the existing extras loader in
// main.jsx, and skip during prerender so nothing leaks into the prerendered
// HTML payload. Microsoft Clarity was removed: it set eight third-party
// cookies (its own MUID/SM/ANONCHK/_clck/_clsk plus Bing Ads MUID/MR/SRM_B)
// which pinned the Lighthouse Best Practices score, and PostHog already
// provides session replays + heatmaps without the cookie load.

function isClientRuntime() {
  if (typeof window === "undefined") return false;
  if (typeof navigator !== "undefined" && navigator.webdriver) return false;
  return true;
}

export function initLinkedInInsightTag(partnerId) {
  if (!partnerId || !isClientRuntime()) return;
  if (window._linkedin_data_partner_ids?.includes(partnerId)) return;
  window._linkedin_partner_id = partnerId;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(partnerId);
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  document.head.appendChild(script);
}

// RB2B (https://rb2b.com) — US-only person-level visitor de-anonymization.
// The vendor script self-bootstraps its queue and starts identifying visitors
// on load. We only need to inject the tag with the team-specific bundle URL.
export function initRb2b(teamId) {
  if (!teamId || !isClientRuntime()) return;
  if (document.querySelector(`script[data-rb2b="${teamId}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.dataset.rb2b = teamId;
  script.src = `https://b2bjsstore.s3.us-west-2.amazonaws.com/b/${teamId}/${teamId}.js.gz`;
  document.head.appendChild(script);
}
