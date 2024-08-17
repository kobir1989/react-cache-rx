import axios, { AxiosRequestConfig } from 'axios'
import { useConfig } from '../context/ConfigContext'
import { FetchOptions } from '../types'

export const fetcher = async (url: string, options: FetchOptions) => {
  const config = useConfig()

  const axiosConfig: AxiosRequestConfig = {
    url: config.baseUrl ? `${config.baseUrl}${url}` : url,
    method: 'GET',
    headers: {
      ...(config.headers || {}),
      ...(options?.headers || {}),
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    params: options?.params,
    timeout: options?.timeout || config.timeout || 1000,
    responseType: options?.responseType || config.responseType || 'json'
  }

  try {
    const response = await axios(axiosConfig)
    return response.data
  } catch (error) {
    throw new Error('Something went wrong!')
  }
}
