import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Cookie / tracking consent banner.
//
// State machine, persisted to localStorage under `pcc-consent`:
//   "unset"     — no choice yet, banner is visible
//   "accepted"  — analytics + visibility tags may run
//   "declined"  — analytics + visibility tags must not run; show a brief
//                 confirmation strip so the user knows their choice stuck
//
// SSR / prerender safety: the banner mounts only after the first effect
// fires on the client, so the prerendered HTML never contains it (no
// flash-of-banner on hydrate, no layout shift counted by Speed Insights).
//
// Future hook-up: src/main.jsx loads bots / analytics scripts inside an
// idle callback. Once we honour the choice for real, that loader should
// short-circuit on `localStorage.getItem("pcc-consent") === "declined"`.
const STORAGE_KEY = "pcc-consent";

function readConsent() {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "declined") return v;
    return "unset";
  } catch {
    return "unset";
  }
}

function writeConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
    // Surface it to other tabs / future analytics gates.
    window.dispatchEvent(new CustomEvent("pcc:consent", { detail: value }));
  } catch {
    /* private mode / storage disabled — nothing we can do, behave as
       if declined for this session */
  }
}

export default function CookieConsent() {
  // Start hidden. The first effect decides whether to show the banner —
  // this keeps the SSR/prerender payload identical for everyone.
  const [state, setState] = useState("hidden");

  useEffect(() => {
    const choice = readConsent();
    if (choice === "unset") setState("prompt");
    // If accepted or declined on a prior visit we stay hidden.
  }, []);

  if (state === "hidden") return null;

  const onAccept = () => {
    writeConsent("accepted");
    setState("hidden");
  };
  const onDecline = () => {
    writeConsent("declined");
    setState("declined-confirm");
    // Auto-dismiss the confirmation strip after a few seconds.
    window.setTimeout(() => setState("hidden"), 4500);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={state === "declined-confirm" ? "Tracking preference saved" : "Cookie consent"}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-md border border-[var(--color-border-soft)] bg-white p-4 shadow-lg motion-safe:animate-fade-up md:p-5"
    >
      {state === "prompt" ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
          <p className="text-sm leading-6 text-[var(--color-ink)]">
            We use cookies to keep the site running, remember your preferences, and learn what
            visitors find useful. See our{" "}
            <Link
              to="/privacy"
              viewTransition
              className="font-bold text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-navy)]"
            >
              Privacy Policy
            </Link>{" "}
            for the full breakdown.
          </p>
          <div className="flex shrink-0 gap-2 md:ml-auto">
            <Button variant="ghost" size="sm" onClick={onDecline}>
              Decline
            </Button>
            <Button variant="primary" size="sm" onClick={onAccept}>
              Accept
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink)]">
          <span className="font-bold">Got it.</span> We won&apos;t track your visit. We keep one
          small cookie so we don&apos;t ask you again next time.
        </p>
      )}
    </div>
  );
}
