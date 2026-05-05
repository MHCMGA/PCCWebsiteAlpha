import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { initBotId } from 'botid/client/core'
import './index.css'
import App from './App.jsx'

initBotId({
  protect: [{ path: '/api/contact', method: 'POST' }],
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
