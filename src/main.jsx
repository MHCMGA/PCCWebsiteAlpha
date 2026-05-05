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

// Prerendered routes (see scripts/prerender.mjs) ship rendered HTML — hydrate
// to attach event handlers without a re-paint. SPA fallback routes get the
// empty shell, so createRoot for those.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, tree)
} else {
  createRoot(rootEl).render(tree)
}

const initBot = () =>
  import('botid/client/core').then(({ initBotId }) =>
    initBotId({ protect: [{ path: '/api/contact', method: 'POST' }] })
  )

if ('requestIdleCallback' in window) {
  requestIdleCallback(initBot, { timeout: 2000 })
} else {
  setTimeout(initBot, 1500)
}
