import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactGA from 'react-ga4'

// Initialize Google Analytics 4
ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
