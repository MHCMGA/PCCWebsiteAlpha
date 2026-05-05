import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')
const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Prerendered routes (see scripts/prerender.mjs) ship rendered HTML - hydrate
// to attach event handlers without a re-paint. SPA fallback routes get the
// empty shell, so createRoot for those.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, tree)
} else {
  createRoot(rootEl).render(tree)
}

// Defer all client-only extras (toaster, analytics, bot detection) until after
// hydration + idle. Skip during prerender (puppeteer sets navigator.webdriver)
// so they never appear in the prerendered HTML payload.
if (!navigator.webdriver) {
  const loadExtras = async () => {
    try {
      const [
        { createElement, Fragment },
        { Toaster },
        { Analytics },
        { SpeedInsights },
        { initBotId },
      ] = await Promise.all([
        import('react'),
        import('@/components/ui/sonner'),
        import('@vercel/analytics/react'),
        import('@vercel/speed-insights/react'),
        import('botid/client/core'),
      ])
      const host = document.createElement('div')
      host.id = 'extras-root'
      document.body.appendChild(host)
      createRoot(host).render(
        createElement(Fragment, null,
          createElement(Toaster),
          createElement(Analytics),
          createElement(SpeedInsights),
        )
      )
      initBotId({ protect: [{ path: '/api/contact', method: 'POST' }] })
    } catch (err) {
      console.warn('[extras] failed to load', err)
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadExtras, { timeout: 2000 })
  } else {
    setTimeout(loadExtras, 1500)
  }
}
