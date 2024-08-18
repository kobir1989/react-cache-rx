import { FetchOptions } from '../types'
import { fetcher } from './fetcher'
import { deleteCacheEntry, getCacheEntry, setCacheEntry } from './indexDB'

export const cacheFetcher = async (url: string, options: FetchOptions) => {
  const cacheDuration = options.cacheDuration || 30000 // Default to 30 seconds

  // Try to get data from IndexedDB
  const cachedEntry = await getCacheEntry(url)

  if (cachedEntry) {
    const currentTime = Date.now()
    if (currentTime - cachedEntry.timestamp < cacheDuration) {
      return cachedEntry.data
    } else {
      // Cache is expired
      await deleteCacheEntry(url)
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
  await setCacheEntry(url, data)

  return data
}
