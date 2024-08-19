/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { MutateOptions, MutationMethod } from '../types'
import { useConfig } from '../context'
import axios, { AxiosResponse } from 'axios'

export const useMutation = (
  url: string,
  method: MutationMethod,
  options: MutateOptions
) => {
  const config = useConfig()
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const mutate = async (body: any) => {
    setLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response: AxiosResponse = await axios({
        url,
        method,
        data: body,
        ...options,
        ...config
      })
      setData(response.data)
      options.onSuccess?.(response.data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err)
        options.onError?.(err)
      } else {
        const unknownError = new Error('An unknown error occurred')
        setError(unknownError)
        options.onError?.(unknownError)
      }
      setIsError(true)
    } finally {
      setLoading(false)
      options.onSettled?.(data, error)
    }
  }

  return { data, error, isError, loading, mutate }
}
