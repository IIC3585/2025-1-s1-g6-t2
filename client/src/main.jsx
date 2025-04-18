import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Si el archivo está en client/public/service-worker.js
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registrado', reg))
      .catch(err => console.error('Error SW:', err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



