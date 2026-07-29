import { Alert } from '@mui/material'
import { useEffect, useState, type ReactNode } from 'react'

interface OfflineBannerProps {
  children: ReactNode
}

export const OfflineBanner = ({ children }: OfflineBannerProps) => {
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  )

  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {offline ? (
        <Alert severity='warning' sx={{ borderRadius: 0, justifyContent: 'center' }}>
          Sin conexión a internet. Algunas funciones pueden no estar disponibles.
        </Alert>
      ) : null}
      {children}
    </>
  )
}
