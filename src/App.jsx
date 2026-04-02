import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

const Home    = lazy(() => import('./pages/Home/Home'))
const About   = lazy(() => import('./pages/About/About'))
const Contact = lazy(() => import('./pages/Contact/Contact'))

function PageLoader() {
  return <div style={{ minHeight: '60vh' }} aria-hidden="true" />
}

function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
