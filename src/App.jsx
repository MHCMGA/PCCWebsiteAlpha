import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Home from '@/pages/Home/Home';
import { SITE } from '@/lib/site';

const About    = lazy(() => import('@/pages/About/About'));
const Contact  = lazy(() => import('@/pages/Contact/Contact'));
const Analytics    = lazy(() =>
  import('@vercel/analytics/react').then((m) => ({ default: m.Analytics }))
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((m) => ({ default: m.SpeedInsights }))
);

function PageLoader() {
  return <div className="min-h-[140vh]" aria-hidden="true" />;
}

function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <Helmet>
        <title>Page Not Found | Palmetto Consulting of Columbia</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal)]">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--color-navy)]">Page not found</h1>
      <p className="mt-4 text-[var(--color-muted)]">The page you&apos;re looking for doesn&apos;t exist.</p>
      <a
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-[var(--color-teal)] px-6 text-sm font-bold uppercase tracking-[0.08em] text-white"
      >
        Return Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {/* Site-wide SEO defaults - only invariant tags. Per-page Helmet owns title/canonical/description/og:url/og:title/og:description. */}
      <Helmet htmlAttributes={{ lang: 'en' }}>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:image" content={SITE.ogImage} />
        <meta property="og:image:secure_url" content={SITE.ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Palmetto Consulting of Columbia, PCC logo" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SITE.ogImage} />
        <meta name="twitter:image:alt" content="Palmetto Consulting of Columbia, PCC logo" />
      </Helmet>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*"        element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster />
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </ErrorBoundary>
  );
}
