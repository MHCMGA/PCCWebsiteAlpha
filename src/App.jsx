import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Home    = lazy(() => import('@/pages/Home/Home'));
const About   = lazy(() => import('@/pages/About/About'));
const Contact = lazy(() => import('@/pages/Contact/Contact'));

function PageLoader() {
  return <div className="min-h-[60vh]" aria-hidden="true" />;
}

function NotFound() {
  return (
    <div className="container-x py-24 text-center">
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
      <Helmet htmlAttributes={{ lang: 'en' }} />
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
      <Analytics />
    </ErrorBoundary>
  );
}
