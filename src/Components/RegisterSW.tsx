'use client'

import { useEffect } from 'react'

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

export function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful:', registration.scope)
          },
          (err) => {
            console.log('ServiceWorker registration failed:', err)
          }
        )
      })
    }
  }, [])

  return null
} 