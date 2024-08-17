import React, { Component, ErrorInfo } from 'react'
import { ErrorBoundaryProps, ErrorBoundaryState } from '../types'

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <p
            style={{ color: '#cc2121', fontSize: '14px', textAlign: 'center' }}
          >
            Something went wrong.
          </p>
        )
      )
    }

    return this.props.children
  }
}
