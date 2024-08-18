import axios, { AxiosRequestConfig } from 'axios'
import { FetchOptions } from '../types'

export const fetcher = async (url: string, options: FetchOptions) => {
  const axiosConfig: AxiosRequestConfig = {
    url: options.baseUrl ? `${options.baseUrl}${url}` : url,
    method: 'GET',
    headers: {
      ...(options.headers || {}),
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    params: options?.params,
    timeout: options.timeout || 1000,
    responseType: options?.responseType || options.responseType || 'json'
  }

  try {
    const response = await axios(axiosConfig)
    return response.data
  } catch (_error) {
    throw new Error('Something went wrong!')
  }
}
