import { useState, useEffect } from 'react'
import { FetchOptions } from '../types'
import { cacheFetcher } from '../core'
import { useConfig } from '../context'

export const useFetch = (url: string, options: FetchOptions) => {
  const config = useConfig()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<null | Error>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const {
    revalidateOnFocus = false,
    retries = 3,
    retryDelay = 4000,
    cacheDuration,
    ...otherOptions
  } = options
  const fetchData = async (attempt = 1) => {
    setLoading(true)
    try {
      const result = await cacheFetcher(
        url,
        {
          ...otherOptions,
          cacheDuration
        },
        { ...config }
      )
      setData(result)
      setError(null)
      options.onSuccess?.(result)
    } catch (err) {
      if (attempt <= retries) {
        setTimeout(() => fetchData(attempt + 1), retryDelay)
      } else {
        if (err instanceof Error) {
          setError(err)
          options.onError?.(err)
        } else {
          setError(new Error('An unknown error occurred'))
          options.onError?.(new Error('An unknown error occurred'))
        }
        setIsError(true)
      }
    } finally {
      setLoading(false)
      options.onSettled?.(data, error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url, retries, retryDelay, cacheDuration])

  useEffect(() => {
    if (revalidateOnFocus) {
      const handleFocus = () => fetchData()
      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    }
  }, [revalidateOnFocus])

  return { data, error, loading, isError }
}
