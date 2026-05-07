// Third-party visibility scripts: Microsoft Clarity (session replays + heatmaps)
// and LinkedIn Insight Tag (company / job-title visitor identification).
//
// Both follow the same lazy/idle pattern as the existing extras loader in
// main.jsx, and skip during prerender so nothing leaks into the prerendered
// HTML payload. Clarity uses the official @microsoft/clarity SDK; LinkedIn is
// a hand-rolled tag inject (LinkedIn does not ship an npm package).

import Clarity from "@microsoft/clarity";

function isClientRuntime() {
  if (typeof window === "undefined") return false;
  if (typeof navigator !== "undefined" && navigator.webdriver) return false;
  return true;
}

export function initClarity(projectId) {
  if (!projectId || !isClientRuntime()) return;
  Clarity.init(projectId);
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
