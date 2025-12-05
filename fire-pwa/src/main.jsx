import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/App.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// O Service Worker é registrado automaticamente pelo vite-plugin-pwa
// Não é necessário registrar manualmente

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)