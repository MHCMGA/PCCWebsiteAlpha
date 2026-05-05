import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-extrabold text-[var(--color-navy)] mb-4">
            Something went wrong.
          </h1>
          <p className="text-[var(--color-muted)] mb-6">
            Please refresh the page. If the problem persists, contact us.
          </p>
          <a
            href="/"
            className="inline-flex h-11 items-center px-6 bg-[var(--color-teal)] text-white font-bold uppercase tracking-wider rounded-sm"
          >
            Return Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
