import * as React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("App error:", error, info);
    // Forward to Sentry if it has been initialized. Lazy-import so the SDK
    // never lands in the initial bundle — Sentry queues calls made before
    // init() and replays them once the queue drains.
    import("@sentry/react")
      .then(({ captureException }) => {
        captureException(error, {
          contexts: { react: { componentStack: info?.componentStack } },
        });
      })
      .catch(() => {});
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container-x py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal)]">
            Error
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--color-navy)]">
            Something went wrong
          </h1>
          <p className="mt-4 text-[var(--color-muted)]">
            Please refresh the page or call 803-904-8461.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-sm bg-[var(--color-teal)] px-6 text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Return Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
