import { Link } from "react-router-dom";
import { Section, Eyebrow } from "@/components/ui/section";
import { SITE } from "@/lib/site";

const DOMAIN = SITE.domain;
const LAST_UPDATED = "May 14, 2026";

export default function Privacy() {
  return (
    <>
      <title>Privacy Policy | Palmetto Consulting of Columbia</title>
      <meta
        name="description"
        content="How Palmetto Consulting of Columbia, LLC handles visitor information on palmettoconsulting.us, including cookies, analytics, and third-party processors."
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${DOMAIN}/privacy`} />

      <Section>
        <div className="mx-auto max-w-2xl">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mb-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-navy)]">
            Privacy Policy
          </h1>
          <p className="mb-10 text-sm text-[var(--color-muted)]">Last updated {LAST_UPDATED}.</p>

          <div className="space-y-8 text-base leading-7 text-[var(--color-ink)]">
            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">
                Who this policy covers
              </h2>
              <p>
                This page explains how <strong>Palmetto Consulting of Columbia, LLC</strong>{" "}
                (&ldquo;PCC&rdquo;, &ldquo;we&rdquo;) handles information you share with us through{" "}
                <Link
                  to="/"
                  viewTransition
                  className="text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-navy)]"
                >
                  palmettoconsulting.us
                </Link>
                . It does not cover how we handle information shared inside a paid engagement — that
                is governed by the consulting agreement signed with each client.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">
                What we collect from visitors
              </h2>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Contact form submissions</strong> — the name, email address, and message
                  body you provide when you fill out the form at{" "}
                  <Link
                    to="/contact"
                    viewTransition
                    className="text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-navy)]"
                  >
                    /contact
                  </Link>
                  . These go directly to our team inbox and nowhere else.
                </li>
                <li>
                  <strong>Anonymous analytics</strong> — page views, route, referrer, device type,
                  and Core Web Vitals via Vercel Web Analytics and Vercel Speed Insights. No IP
                  address is stored; no cookies are set; no cross-site identifier is built.
                </li>
                <li>
                  <strong>Error and performance telemetry</strong> — if a page errors, Sentry
                  collects the browser environment and stack trace so we can fix the bug. This data
                  is retained for 30 days.
                </li>
                <li>
                  <strong>Bot protection</strong> — Vercel BotID inspects the request shape on the
                  contact and ask endpoints to keep automated submissions out. It does not persist
                  any identifier on your device.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">Cookies</h2>
              <p className="mb-3">
                We use exactly one first-party item in <code>localStorage</code>:{" "}
                <code className="rounded-sm bg-[var(--color-bg)] px-1.5 py-0.5 text-sm">
                  pcc-consent
                </code>
                . It records whether you accepted or declined optional trackers on this site so the
                banner does not reappear on every visit. You can clear it any time from your
                browser&apos;s site-data settings.
              </p>
              <p>
                We do not use cross-site advertising cookies, retargeting pixels, or browser
                fingerprinting.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">
                Optional trackers (only after Accept)
              </h2>
              <p className="mb-3">
                When you click <strong>Accept</strong> on the cookie banner, we may also load two
                visitor-identification scripts that help us understand which firms are evaluating
                our services:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>LinkedIn Insight Tag</strong> — LinkedIn&apos;s server-side script that
                  matches LinkedIn-logged-in visits back to a job title and company. It sets
                  third-party LinkedIn cookies on your device.
                </li>
                <li>
                  <strong>RB2B</strong> — a US-only person-level visitor de-anonymization service
                  that may identify a visitor by name and email when the visit can be matched to
                  RB2B&apos;s opt-in B2B graph.
                </li>
              </ul>
              <p className="mt-3">
                Decline on the banner and neither script loads, on this or subsequent visits.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">
                Where data is stored
              </h2>
              <p>
                The site is hosted by Vercel in US data centres. Contact-form emails are delivered
                through Resend. Error telemetry is stored by Sentry. Each of these is a US-based
                processor bound by their own published privacy terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">Your rights</h2>
              <p>
                If you have submitted information through the contact form and want it deleted,
                email{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-navy)]"
                >
                  {SITE.email}
                </a>{" "}
                with the subject line &ldquo;Privacy request&rdquo; and we will remove it within ten
                business days.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[var(--color-navy)]">
                Updates to this policy
              </h2>
              <p>
                If we materially change how we handle visitor information we will update the
                &ldquo;Last updated&rdquo; date above and, where appropriate, surface a fresh
                consent prompt.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}
