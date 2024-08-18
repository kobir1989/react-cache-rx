# `useFetch` Hook

The `useFetch` hook is a custom React hook designed for fetching data, caching responses, handling retries, and managing loading and error states. It integrates with IndexedDB for caching and provides flexibility through various options.

## Installation

First, install the library:

```bash
npm install your-library-name

```

```js
import React from 'react';
import { useFetch } from 'your-library-name';

const MyComponent = () => {
  const { data, error, loading, isError, fetchData } = useFetch('/api/data', {
    retries: 3,
    retryDelay: 2000,
    cacheDuration: 30000,
    onSuccess: (data) => console.log('Data fetched successfully:', data),
    onError: (error) => console.error('Error fetching data:', error),
  });

  if (loading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => fetchData()}>Refetch</button>
    </div>
  );
};

export default MyComponent;
```

### `options` Properties

- **`revalidateOnFocus`**: *(optional)* Boolean indicating whether to revalidate data when the window regains focus. Defaults to `false`.
- **`retries`**: *(optional)* Number of times to retry fetching data in case of failure. Defaults to `3`.
- **`retryDelay`**: *(optional)* Delay in milliseconds between retries. Defaults to `4000` (4 seconds).
- **`cacheDuration`**: *(optional)* Duration in milliseconds to cache the response. Defaults to `30000` (30 seconds).
- **`isInvalidate`**: *(optional)* Boolean indicating whether to invalidate the cache entry for the URL before fetching new data.
- **`isFetchOnClick`**: *(optional)* Boolean indicating whether to fetch data only when `fetchData` is called. Defaults to `false`.
- **`onSuccess`**: *(optional)* Callback function called when data is successfully fetched.
- **`onError`**: *(optional)* Callback function called when an error occurs during fetching.
- **`onSettled`**: *(optional)* Callback function called after the fetch attempt completes, regardless of success or failure.

## `useConfig` Hook

To use the `useFetch` hook, you need to wrap your component tree with the `ConfigProvider` and provide the configuration:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'your-library-name';
import App from './App';

const config = {
  baseUrl: 'https://api.example.com',
  token: 'your-token',
};

ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);

```