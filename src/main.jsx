import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Ambient } from './components/brand'
import { Toaster } from './components/ui/Toaster'
import App from './App'
import './index.css'

function Shell() {
  return (
    <>
      <Ambient />
      <App />
      <Toaster />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Shell />
  </StrictMode>
)
