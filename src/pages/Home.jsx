import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import CountryCard from '../components/CountryCard'

function Home() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setCountries([])
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)

      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('No countries found.')
          }
          return response.json()
        })
        .then((data) => {
          setCountries(data)
          setError(null)
        })
        .catch((fetchError) => {
          if (fetchError.name === 'AbortError') return
          setCountries([])
          setError('No countries found.')
        })
        .finally(() => {
          setLoading(false)
        })
    }, 400)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const trimmedQuery = query.trim()

  return (
    <section className="home">
      <SearchBar query={query} onQueryChange={setQuery} />

      {loading && <p className="home__status">Loading...</p>}
      {error && <p className="home__status home__status--error">{error}</p>}
      {!loading && !error && countries.length === 0 && !trimmedQuery && (
        <p className="home__status">Start searching to explore countries.</p>
      )}

      {!loading && !error && countries.length > 0 && (
        <div className="cards-grid">
          {countries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home
