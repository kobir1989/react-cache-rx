import { DB_NAME, STORE_NAME } from '../constants'

const openDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' })
        console.log('Object store created:', STORE_NAME)
      } else {
        console.log('Object store already exists:', STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = event => {
      console.error(
        'Error opening database:',
        (event.target as IDBRequest).error
      )
      reject((event.target as IDBRequest).error)
    }
  })
}

export const setCacheEntry = async (url: string, data: unknown) => {
  const db = await openDatabase()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  const timestamp = Date.now()

  const request = store.put({ url, data, timestamp })
  request.onsuccess = () => console.log('Data successfully inserted')
  request.onerror = event =>
    console.error('Error inserting data:', (event.target as IDBRequest).error)

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const getCacheEntry = async (url: string) => {
  const db = await openDatabase()
  const transaction = db.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)

  const request = store.get(url)
  return new Promise<{ data: unknown; timestamp: number } | null>(
    (resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        console.error('Error retrieving data from IndexedDB:', request.error)
        reject(request.error)
      }
    }
  )
}

export const deleteCacheEntry = async (url: string) => {
  const db = await openDatabase()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  const request = store.delete(url)
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve()
    request.onerror = () => {
      console.error('Error deleting data from IndexedDB:', request.error)
      reject(request.error)
    }
  })
}
