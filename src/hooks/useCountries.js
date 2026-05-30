import { useEffect, useState } from 'react'

const API_URL = 'https://restcountries.com/v3.1'

export default function useCountries(query) {
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
    const url = `${API_URL}/name/${encodeURIComponent(trimmedQuery)}?fields=name,cca3,flags,region,population,capital`

    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No countries matched your search.')
        }
        return response.json()
      })
      .then((data) => {
        setCountries(data)
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
          setCountries([])
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [query])

  return { countries, loading, error }
}
