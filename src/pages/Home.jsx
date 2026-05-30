import { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import useCountries from '../hooks/useCountries'

function Home() {
  const [query, setQuery] = useState('')
  const { countries, loading, error } = useCountries(query)
  const hasQuery = query.trim().length > 0

  return (
    <section className="home">
      <SearchBar query={query} onQueryChange={setQuery} />

      {!hasQuery && (
        <p className="home__placeholder">Search for a country by name to start exploring.</p>
      )}

      {hasQuery && loading && <p className="home__status">Loading countries…</p>}
      {hasQuery && error && <p className="home__error">{error}</p>}
      {hasQuery && !loading && !error && countries.length === 0 && (
        <p className="home__status">No countries matched “{query}”.</p>
      )}

      {countries.length > 0 && (
        <ul className="country-list">
          {countries.map((country) => (
            <li key={country.cca3} className="country-card">
              <Link
                to={`/country/${encodeURIComponent(country.name.common)}`}
                className="country-card__link"
              >
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="country-card__flag"
                />
                <div className="country-card__content">
                  <h2>{country.name.common}</h2>
                  <p>{country.region}</p>
                  <p>{country.population.toLocaleString()} people</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Home
