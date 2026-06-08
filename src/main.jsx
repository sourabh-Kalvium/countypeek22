import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { FavouritesProvider } from './context/FavouritesContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <FavouritesProvider>
        <App />
      </FavouritesProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
