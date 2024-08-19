# react-cache-rx

![npm version](https://img.shields.io/badge/npm-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Downloads](https://img.shields.io/npm/dt//react-cache)
![GitHub stars](https://img.shields.io/github/stars/kobir1989/react-cache)
![GitHub forks](https://img.shields.io/github/forks/kobir1989/react-cache)
![GitHub issues](https://img.shields.io/github/issues/kobir1989/react-cache)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kobir1989/react-cache)
![Maintenance](https://img.shields.io/maintenance/yes/2024)

The `react-cache-rx` library provides a custom hook, `useFetch()`, which is designed for data fetching, response caching, retry handling, and managing loading and error states. It leverages IndexedDB for caching and offers a range of options for flexible integration.

## Installation

First, install the library:

```bash
npm install fetch-cache-rx

```

## Global Configuration with ConfigProvider

To use the `useFetch` hook, you need to wrap your component tree with the `ConfigProvider` and provide the configuration:

The ConfigProvider allows you to set global configurations that will apply across your entire application. This is useful for settings like baseUrl, authentication tokens, default headers, and more.

### Basic Example

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'fetch-cache-rx'
import App from './App'

const config = {
  baseUrl: 'https://api.example.com',
  token: 'your-token'
}

ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
```

## Available Configuration Options

The `ConfigProvider` allows you to configure your requests globally, similar to how you would with Axios. Here are all the available configuration options you can set:

| Option               | Description                                                                                                        | Default          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------- |
| **baseUrl**          | (optional) Base URL for all requests.                                                                              | `''`             |
| **token**            | (optional) Authentication token to be included in requests.                                                        |                  |
| **defaultHeaders**   | (optional) Object representing default headers to include in every request.                                        |                  |
| **timeout**          | (optional) Timeout duration for requests in milliseconds.                                                          | `0` (no timeout) |
| **withCredentials**  | (optional) Boolean indicating whether to include credentials in cross-site Access-Control requests.                | `false`          |
| **responseType**     | (optional) Indicates the type of data expected from the server. Options include `'json'`, `'text'`, `'blob'`, etc. | `'json'`         |
| **xsrfCookieName**   | (optional) The name of the cookie to use as a value for the XSRF token.                                            | `'XSRF-TOKEN'`   |
| **xsrfHeaderName**   | (optional) The name of the HTTP header that carries the XSRF token value.                                          | `'X-XSRF-TOKEN'` |
| **onRequestStart**   | (optional) Callback function triggered at the start of a request.                                                  |                  |
| **onRequestError**   | (optional) Callback function triggered when a request fails.                                                       |                  |
| **onRequestSuccess** | (optional) Callback function triggered when a request succeeds.                                                    |                  |
| **onRequestEnd**     | (optional) Callback function triggered at the end of a request.                                                    |                  |

### Advanced Configuration Example

```js
const config = {
  baseUrl: 'https://api.example.com',
  token: 'your-token',
  defaultHeaders: {
    'Content-Type': 'application/json',
    Authorization: `Bearer your-token`
  },
  timeout: 5000, // in milliseconds
  withCredentials: true,
  responseType: 'json',
  xsrfCookieName: 'MY-XSRF-TOKEN',
  xsrfHeaderName: 'MY-X-XSRF-TOKEN',
  onRequestStart: (url, options) => {
    console.log(`Starting request to ${url} with options:`, options)
  },
  onRequestError: error => {
    console.error('Request failed:', error)
  },
  onRequestSuccess: response => {
    console.log('Request succeeded:', response)
  },
  onRequestEnd: () => {
    console.log('Request ended')
  }
}

ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
```

# `useFetch` Hook

```js
import React from 'react'
import { useFetch } from 'fetch-cache-rx'

const MyComponent = () => {
  const { data, error, loading, isError, fetchData } = useFetch('/api/data', {
    retries: 3,
    retryDelay: 2000,
    cacheDuration: 30000,
    onSuccess: data => console.log('Data fetched successfully:', data),
    onError: error => console.error('Error fetching data:', error)
  })

  if (loading) return <p>Loading...</p>
  if (isError) return <p>Error: {error?.message}</p>

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => fetchData()}>Refetch</button>
    </div>
  )
}

export default MyComponent
```

## Options Properties

| Option                | Description                                                                                               | Default              |
| --------------------- | --------------------------------------------------------------------------------------------------------- | -------------------- |
| **revalidateOnFocus** | (optional) Boolean indicating whether to revalidate data when the window regains focus.                   | `false`              |
| **retries**           | (optional) Number of times to retry fetching data in case of failure.                                     | `3`                  |
| **retryDelay**        | (optional) Delay in milliseconds between retries.                                                         | `4000` (4 seconds)   |
| **cacheDuration**     | (optional) Duration in milliseconds to cache the response.                                                | `30000` (30 seconds) |
| **isInvalidate**      | (optional) Boolean indicating whether to invalidate the cache entry for the URL before fetching new data. |                      |
| **isFetchOnClick**    | (optional) Boolean indicating whether to fetch data only when `fetchData` is called.                      | `false`              |
| **onSuccess**         | (optional) Callback function called when data is successfully fetched.                                    |                      |
| **onError**           | (optional) Callback function called when an error occurs during fetching.                                 |                      |
| **onSettled**         | (optional) Callback function called after the fetch attempt completes, regardless of success or failure.  |                      |

## `useMutation` Hook

The `useMutation` hook is a custom React hook designed to handle `POST`, `PUT`, and `DELETE` requests. It simplifies the process of performing these operations by managing loading, error, and success states, while also allowing for easy configuration and customization.

### Basic Example

Here's a basic example of how to use the `useMutation` hook to create a new resource using a `POST` request:

```js
import React from 'react'
import { useMutation } from 'fetch-cache-rx'

const MyComponent = () => {
  const { mutate, data, error, loading } = useMutation(
    '/api/resource',
    'POST',
    {
      onSuccess: data => console.log('Mutation successful:', data),
      onError: error => console.error('Mutation failed:', error)
    }
  )

  const handleSubmit = () => {
    const payload = { name: 'New Resource' }
    mutate(payload)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <button onClick={handleSubmit}>Create Resource</button>
      {data && <p>Resource created: {JSON.stringify(data)}</p>}
    </div>
  )
}

export default MyComponent
```
