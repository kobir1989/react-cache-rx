# `useFetch` Hook

The `useFetch` hook is a custom React hook designed for fetching data, caching responses, handling retries, and managing loading and error states. It integrates with IndexedDB for caching and provides flexibility through various options.

## Installation

First, install the library:

```bash
npm install fetch-cache-rx

```

```js
import React from 'react'
import { useFetch } from 'your-library-name'

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

### `options` Properties

- **`revalidateOnFocus`**: _(optional)_ Boolean indicating whether to revalidate data when the window regains focus. Defaults to `false`.
- **`retries`**: _(optional)_ Number of times to retry fetching data in case of failure. Defaults to `3`.
- **`retryDelay`**: _(optional)_ Delay in milliseconds between retries. Defaults to `4000` (4 seconds).
- **`cacheDuration`**: _(optional)_ Duration in milliseconds to cache the response. Defaults to `30000` (30 seconds).
- **`isInvalidate`**: _(optional)_ Boolean indicating whether to invalidate the cache entry for the URL before fetching new data.
- **`isFetchOnClick`**: _(optional)_ Boolean indicating whether to fetch data only when `fetchData` is called. Defaults to `false`.
- **`onSuccess`**: _(optional)_ Callback function called when data is successfully fetched.
- **`onError`**: _(optional)_ Callback function called when an error occurs during fetching.
- **`onSettled`**: _(optional)_ Callback function called after the fetch attempt completes, regardless of success or failure.

## Global Configuration with ConfigProvider

To use the `useFetch` hook, you need to wrap your component tree with the `ConfigProvider` and provide the configuration:

The ConfigProvider allows you to set global configurations that will apply across your entire application. This is useful for settings like baseUrl, authentication tokens, default headers, and more.

### Basic Example
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'your-library-name'
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

- **baseUrl**: (optional) Base URL for all requests. Defaults to `''`.
- **token**: (optional) Authentication token to be included in requests.
- **defaultHeaders**: (optional) Object representing default headers to include in every request.
- **timeout**: (optional) Timeout duration for requests in milliseconds. Defaults to `0` (no timeout).
- **withCredentials**: (optional) Boolean indicating whether to include credentials in cross-site Access-Control requests. Defaults to `false`.
- **responseType**: (optional) Indicates the type of data expected from the server. Options include `'json'`, `'text'`, `'blob'`, etc. Defaults to `'json'`.
- **xsrfCookieName**: (optional) The name of the cookie to use as a value for the XSRF token. Defaults to `'XSRF-TOKEN'`.
- **xsrfHeaderName**: (optional) The name of the HTTP header that carries the XSRF token value. Defaults to `'X-XSRF-TOKEN'`.
- **onRequestStart**: (optional) Callback function triggered at the start of a request.
- **onRequestError**: (optional) Callback function triggered when a request fails.
- **onRequestSuccess**: (optional) Callback function triggered when a request succeeds.
- **onRequestEnd**: (optional) Callback function triggered at the end of a request.


### Advanced Configuration Example

```js
const config = {
  baseUrl: 'https://api.example.com',
  token: 'your-token',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your-token`,
  },
  timeout: 5000, // in milliseconds
  withCredentials: true,
  responseType: 'json',
  xsrfCookieName: 'MY-XSRF-TOKEN',
  xsrfHeaderName: 'MY-X-XSRF-TOKEN',
  onRequestStart: (url, options) => {
    console.log(`Starting request to ${url} with options:`, options);
  },
  onRequestError: (error) => {
    console.error('Request failed:', error);
  },
  onRequestSuccess: (response) => {
    console.log('Request succeeded:', response);
  },
  onRequestEnd: () => {
    console.log('Request ended');
  },
};

ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);
```
