import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Snackbar, Alert, type AlertColor } from '@mui/material'

interface ToastState {
  open: boolean
  message: string
  severity: AlertColor
}

interface ToastContextValue {
  showToast: (message: string, severity?: AlertColor) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ToastState>({ open: false, message: '', severity: 'info' })

  const showToast = useCallback((message: string, severity: AlertColor = 'success') => {
    setState({ open: true, message, severity })
  }, [])

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={state.severity} variant='filled' onClose={handleClose} sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
