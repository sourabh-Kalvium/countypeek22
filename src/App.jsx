import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Header from './components/Header'
import Home from './pages/Home'
import CountryPage from './pages/CountryPage'
import Favourites from './pages/Favourites'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
