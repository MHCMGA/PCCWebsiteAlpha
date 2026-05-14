import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { readConsent, writeConsent } from "@/lib/consent";

// Privacy-preferences strip.
//
// State machine, persisted by lib/consent under `pcc-consent`:
//   "unset"     no choice yet, strip is visible
//   "accepted"  analytics + visibility tags may run
//   "declined"  analytics + visibility tags must not run; show a brief
//               confirmation strip so the user knows their choice stuck
//
// Resilience notes (do not undo these without checking Brave / Safari
// private browsing again):
//
//   - Avoids the words "cookie" / "consent" in className, aria-label,
//     and the rendered copy. Brave Shields ships cookie-banner filter
//     lists that match those tokens; some of them apply
//     `pointer-events: none` to the matched element which left the
//     strip visible but unclickable in private windows on mobile.
//   - Renders as <section role="region"> not role="dialog". Many of
//     the same filter lists target role="dialog" + cookie phrasing.
//   - Buttons are plain <button type="button"> with explicit
//     `pointerEvents: 'auto'` inline, so even if a hostile stylesheet
//     reaches the strip, the click targets keep working.
//   - State always updates BEFORE the storage write so a throw in
//     localStorage (Brave / Safari private modes can throw on access
//     entirely) does not prevent dismissal.
//   - A ref-based DOM force-hide is a final fallback so even if React
//     state somehow fails to flush, the next paint hides the strip.
//
// SSR / prerender safety: returns null until the first client effect,
// so the prerendered HTML never contains the strip (no flash, no CLS).

export default function CookieConsent() {
  const [state, setState] = useState("hidden");
  const rootRef = useRef(null);

  useEffect(() => {
    try {
      const choice = readConsent();
      if (choice === "unset") setState("prompt");
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("[privacy] read failed", err);
      }
    }
  }, []);

  if (state === "hidden") return null;

  const dismiss = () => {
    setState("hidden");
    // Belt and suspenders: if React's state flush is somehow blocked,
    // the DOM still goes away on the next paint.
    if (rootRef.current) rootRef.current.style.display = "none";
  };

  const makeHandler = (choice) => (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      if (choice === "accepted") {
        dismiss();
      } else {
        setState("declined-confirm");
        window.setTimeout(dismiss, 4500);
      }
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("[privacy] state update failed", err);
      }
      // Last-resort dismissal so the user is never stuck.
      if (rootRef.current) rootRef.current.style.display = "none";
    }
    try {
      writeConsent(choice);
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("[privacy] write failed", err);
      }
    }
  };

  const onAccept = makeHandler("accepted");
  const onDecline = makeHandler("declined");

  return (
    <section
      ref={rootRef}
      aria-live="polite"
      aria-label="Privacy preferences"
      data-pcc-privacy=""
      style={{ pointerEvents: "auto" }}
      className="pcc-privacy-strip fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-md border border-[var(--color-border-soft)] bg-white p-4 shadow-lg motion-safe:animate-fade-up md:p-5"
    >
      {state === "prompt" ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
          <p className="text-sm leading-6 text-[var(--color-ink)]">
            This site stores a small amount of information in your browser to remember your
            preferences and to learn what visitors find useful. See our{" "}
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
            <button
              type="button"
              onClick={onDecline}
              style={{ pointerEvents: "auto" }}
              className="inline-flex h-9 items-center justify-center rounded-sm px-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2"
            >
              No thanks
            </button>
            <button
              type="button"
              onClick={onAccept}
              style={{ pointerEvents: "auto" }}
              className="inline-flex h-9 items-center justify-center rounded-sm bg-[var(--color-teal)] px-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-all hover:bg-[var(--color-navy)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
            >
              Got it
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink)]">
          <span className="font-bold">Thanks.</span> We will not track your visit. We keep one small
          note in this browser so we do not ask you again next time.
        </p>
      )}
    </section>
  );
}
