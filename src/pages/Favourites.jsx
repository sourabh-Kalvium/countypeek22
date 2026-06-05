import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import CountryCard from '../components/CountryCard'

function Favourites() {
  const { favourites } = useFavourites()

  return (
    <section className="favourites-page">
      <h1>Your favourites</h1>

      {favourites.length === 0 ? (
        <>
          <p className="home__status">
            You do not have any favourites yet. Save a country from the Home page to see it here.
          </p>
          <Link to="/" className="favourites-page__back">
            ← Back to Home
          </Link>
        </>
      ) : (
        <>
          <div className="cards-grid">
            {favourites.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Favourites
