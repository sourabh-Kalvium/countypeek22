import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'https://restcountries.com/v3.1'

function Favourites() {
  const [favourites, setFavourites] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('countryPeekFavourites') || '[]')
    setFavourites(stored)

    if (stored.length === 0) {
      setCountries([])
      return
    }

    setLoading(true)
    setError(null)

    Promise.all(
      stored.map((countryName) =>
        fetch(
          `${API_URL}/name/${encodeURIComponent(countryName)}?fullText=true&fields=name,cca3,flags,region,population,capital`
        ).then((response) => {
          if (!response.ok) {
            throw new Error('Unable to load favourites.')
          }
          return response.json()
        })
      )
    )
      .then((results) => {
        setCountries(results.map((countryData) => countryData[0]))
      })
      .catch((fetchError) => {
        setError(fetchError.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const removeFavourite = (countryName) => {
    const next = favourites.filter((name) => name !== countryName)
    localStorage.setItem('countryPeekFavourites', JSON.stringify(next))
    setFavourites(next)
    setCountries((current) => current.filter((country) => country.name.common !== countryName))
  }

  return (
    <section className="favourites-page">
      <h1>Your favourites</h1>

      {loading && <p className="home__status">Loading favourites…</p>}
      {error && <p className="home__error">{error}</p>}
      {!loading && !error && favourites.length === 0 && (
        <p className="home__placeholder">
          You do not have any favourites yet. Add a country from the search results or detail page.
        </p>
      )}

      {countries.length > 0 && (
        <ul className="country-list">
          {countries.map((country) => (
            <li key={country.cca3} className="country-card">
              <div className="country-card__link country-card__favourite-row">
                <Link to={`/country/${encodeURIComponent(country.name.common)}`}>
                  <img
                    src={country.flags.svg || country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    className="country-card__flag"
                  />
                </Link>
                <div className="country-card__content">
                  <Link to={`/country/${encodeURIComponent(country.name.common)}`}>
                    <h2>{country.name.common}</h2>
                  </Link>
                  <p>{country.region}</p>
                  <p>{country.population.toLocaleString()} people</p>
                </div>
                <button
                  className="remove-favourite-button"
                  onClick={() => removeFavourite(country.name.common)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link to="/" className="favourites-page__back">
        ← Back to Home
      </Link>
    </section>
  )
}

export default Favourites
