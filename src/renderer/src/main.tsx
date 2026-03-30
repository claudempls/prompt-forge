import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import QuickModeApp from './QuickModeApp'
import './index.css'

const isQuickMode = new URLSearchParams(window.location.search).has('quick')

// In quick mode: transparent body + disable background fx
if (isQuickMode) {
  document.documentElement.classList.add('quick-mode')
  document.body.classList.add('quick-mode')
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isQuickMode ? <QuickModeApp /> : <App />}
  </React.StrictMode>
)
