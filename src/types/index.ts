import { ReactNode } from 'react'

interface Callbacks<T = unknown> {
  onSuccess?: (_data: T) => void
  onError?: (_error: Error) => void
  onSettled?: (_data: T | null, _error: Error | null) => void
}

interface Options {
  headers?: HeaderType
  params?: string | Record<string, string>
  token?: string
  responseType?: 'json' | 'text' | 'blob' | 'document' | 'arraybuffer'
  timeout?: number
  baseUrl?: string
}

export interface FetchOptions<T = unknown> extends Callbacks<T>, Options {
  cacheDuration?: number
  revalidateOnFocus?: boolean
  retries?: number
  retryDelay?: number
}

export interface MutateOptions<T = unknown> extends Callbacks<T>, Options {
  method?: 'POST' | 'DELETE' | 'PUT'
  body?: unknown
}

export type HeaderType = Record<string, string>

export type GlobalToken = string | null

export interface ConfigOptions {
  baseUrl?: string
  token?: string
  headers?: Record<string, string>
  timeout?: number
  responseType?: 'json' | 'text' | 'blob'
}

export interface ContextProviderProps {
  children: ReactNode
  config: ConfigOptions
}
