import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const API_URL = 'https://restcountries.com/v3.1'

function CountryPage() {
  const { name } = useParams()
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!name) return

    const controller = new AbortController()
    const encodedName = encodeURIComponent(name)
    const url = `${API_URL}/name/${encodedName}?fullText=true&fields=name,cca3,flags,region,subregion,population,capital,languages,currencies`

    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load country details.')
        }
        return response.json()
      })
      .then((data) => {
        const fetchedCountry = data[0]
        setCountry(fetchedCountry)
        const stored = JSON.parse(localStorage.getItem('countryPeekFavourites') || '[]')
        setIsFavorite(stored.includes(fetchedCountry.name.common))
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [name])

  const toggleFavorite = () => {
    if (!country) return

    const countryName = country.name.common
    const stored = JSON.parse(localStorage.getItem('countryPeekFavourites') || '[]')
    const next = stored.includes(countryName)
      ? stored.filter((item) => item !== countryName)
      : [...stored, countryName]

    localStorage.setItem('countryPeekFavourites', JSON.stringify(next))
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return <div className="country-page"><p>Loading country details…</p></div>
  }

  if (error) {
    return (
      <div className="country-page">
        <p className="home__error">{error}</p>
        <Link to="/">Back to search</Link>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="country-page">
        <p>Country data is not available.</p>
        <Link to="/">Back to search</Link>
      </div>
    )
  }

  const languages = country.languages ? Object.values(country.languages).join(', ') : 'Unknown'
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => `${currency.name} (${currency.symbol || ''})`)
        .join(', ')
    : 'Unknown'

  return (
    <section className="country-page">
      <Link to="/" className="country-page__back">
        ← Back to search
      </Link>
      <div className="country-page__card">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="country-page__flag"
        />
        <div>
          <div className="country-page__header">
            <h1>{country.name.common}</h1>
            <button className="favorite-button" onClick={toggleFavorite}>
              {isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            </button>
          </div>
          <p className="country-page__meta">{country.region} · {country.subregion}</p>
          <ul className="country-page__details">
            <li>
              <strong>Capital:</strong> {country.capital?.join(', ') || 'No capital'}
            </li>
            <li>
              <strong>Population:</strong> {country.population.toLocaleString()}
            </li>
            <li>
              <strong>Languages:</strong> {languages}
            </li>
            <li>
              <strong>Currencies:</strong> {currencies}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CountryPage
