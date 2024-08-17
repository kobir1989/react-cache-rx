import React, { createContext, useContext } from 'react'
import { ConfigOptions, ContextProviderProps } from '../types'

const ConfigContext = createContext<ConfigOptions | undefined>(undefined)

export const ConfigProvider = ({ children, config }: ContextProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
