import { FetchOptions } from '../types'
import { fetcher } from './fetcher'

interface CacheEntry {
  data: unknown
  timestamp: number
}

export const cache = new Map<string, CacheEntry>()

export const cacheFetcher = async (url: string, options: FetchOptions) => {
  const cacheDuration = options.cacheDuration || 30000 // Default to 30 seconds

  if (cache.has(url)) {
    const cacheEntry = cache.get(url)!
    const currentTime = Date.now()

    // Check if the cached data is still valid
    if (currentTime - cacheEntry.timestamp < cacheDuration) {
      return cacheEntry.data
    } else {
      // If the cache has expired, clear it
      cache.delete(url)
    }
  }

  // Fetch new data if cache is empty or expired
  const response = await fetcher(url, {
    headers: options?.headers,
    params: options?.params,
    timeout: options?.timeout || 1000,
    responseType: options?.responseType
  })
  const data = await response.json()

  // Store the data with the current timestamp
  cache.set(url, { data, timestamp: Date.now() })

  return data
}

export const clearCache = (url: string) => {
  cache.delete(url)
}
