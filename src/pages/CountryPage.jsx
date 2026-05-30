import { useParams, useNavigate } from 'react-router-dom'
import useCountry from '../hooks/useCountry'
import '../styles/App.css'

function CountryPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { country, loading, error } = useCountry(code)

  if (loading) {
    return (
      <div className="country-page">
        <p className="page-status">Loading country details…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="country-page">
        <p className="page-status page-status--error">{error}</p>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="country-page">
        <p className="page-status">Country data is not available.</p>
      </div>
    )
  }

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    languages,
    currencies,
    borders,
  } = country

  const languageList = languages ? Object.values(languages) : []
  const currencyList = currencies ? Object.values(currencies).map((c) => c.name) : []

  return (
    <section className="country-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="country-page__layout">
        <img
          src={flags.svg || flags.png}
          alt={`Flag of ${name.common}`}
          className="country-page__flag"
        />

        <div className="country-page__info">
          <h2 className="country-page__name">{name.common}</h2>
          <p className="country-page__official">{name.official}</p>

          <div className="country-page__details">
            <div>
              <p>
                <strong>Population:</strong> {population.toLocaleString()}
              </p>
              <p>
                <strong>Region:</strong> {region}
              </p>
              <p>
                <strong>Subregion:</strong> {subregion}
              </p>
            </div>
            <div>
              <p>
                <strong>Capital:</strong> {capital?.[0] ?? 'N/A'}
              </p>
              <p>
                <strong>Languages:</strong> {languageList.join(', ') || 'N/A'}
              </p>
              <p>
                <strong>Currencies:</strong> {currencyList.join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {borders && borders.length > 0 && (
            <div className="border-section">
              <p><strong>Bordering countries:</strong></p>
              <div className="border-list">
                {borders.map((borderCode) => (
                  <span key={borderCode} className="border-badge">
                    {borderCode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CountryPage
