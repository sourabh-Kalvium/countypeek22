import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import CountryCard from '../components/CountryCard'
import FilterBar from '../components/FilterBar'

function Home() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [region, setRegion] = useState('All')
  const [sortBy, setSortBy] = useState('')

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

  useEffect(() => {
    if (query.trim() === '') {
      setRegion('All')
      setSortBy('')
    }
  }, [query])

  const displayed = useMemo(() => {
    return [...countries]
      .filter((country) => region === 'All' || country.region === region)
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.common.localeCompare(b.name.common)
        }
        if (sortBy === 'population') {
          return b.population - a.population
        }
        return 0
      })
  }, [countries, region, sortBy])

  const trimmedQuery = query.trim()

  return (
    <section className="home">
      <SearchBar query={query} onQueryChange={setQuery} />
      <FilterBar
        region={region}
        onRegionChange={setRegion}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {loading && <p className="home__status">Loading...</p>}
      {error && <p className="home__status home__status--error">{error}</p>}
      {!loading && !error && displayed.length === 0 && !trimmedQuery && (
        <p className="home__status">Start searching to explore countries.</p>
      )}

      {!loading && !error && displayed.length > 0 && (
        <div className="cards-grid">
          {displayed.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home
