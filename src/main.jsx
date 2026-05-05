import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

const initBot = () =>
  import('botid/client/core').then(({ initBotId }) =>
    initBotId({ protect: [{ path: '/api/contact', method: 'POST' }] })
  )

if ('requestIdleCallback' in window) {
  requestIdleCallback(initBot, { timeout: 2000 })
} else {
  setTimeout(initBot, 1500)
}
