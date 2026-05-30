import { useEffect, useState } from 'react'

const API_URL = 'https://restcountries.com/v3.1'

export default function useCountry(code) {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code) {
      setCountry(null)
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const url = `${API_URL}/alpha/${encodeURIComponent(code)}`

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
        setCountry(data[0])
      })
      .catch((fetchError) => {
        if (fetchError.name === 'AbortError') return
        setCountry(null)
        setError(fetchError.message)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [code])

  return { country, loading, error }
}
