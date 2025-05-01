import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProviderx from './components/Auth/AuthProviderx.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProviderx>
    <App />
    </AuthProviderx>
    
  </StrictMode>,
)
