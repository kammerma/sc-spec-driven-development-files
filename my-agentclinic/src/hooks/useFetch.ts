import { useEffect, useState } from 'react'

type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setState({ status: 'success', data })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Something went wrong',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
