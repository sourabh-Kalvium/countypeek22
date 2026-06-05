import { createContext, useContext, useEffect, useReducer } from 'react'

const FavouritesContext = createContext(null)

function favouritesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVOURITE': {
      const exists = state.some((country) => country.cca3 === action.payload.cca3)
      if (exists) {
        return state
      }
      return [...state, action.payload]
    }
    case 'REMOVE_FAVOURITE':
      return state.filter((country) => country.cca3 !== action.payload)
    default:
      return state
  }
}

function initFavourites() {
  const stored = localStorage.getItem('countryPeekFavourites') || '[]'
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites)

  useEffect(() => {
    localStorage.setItem('countryPeekFavourites', JSON.stringify(favourites))
  }, [favourites])

  return (
    <FavouritesContext.Provider value={{ favourites, dispatch }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  return useContext(FavouritesContext)
}
