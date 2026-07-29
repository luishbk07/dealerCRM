import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { theme } from '@/app/theme'
import { queryClient } from '@/app/queryClient'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { App } from '@/app/App'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { OfflineBanner } from '@/shared/components/OfflineBanner'
import { isDev } from '@/shared/utils/environment'

const ReactQueryDevtools = isDev
  ? lazy(async () => {
      const module = await import('@tanstack/react-query-devtools')
      return { default: module.ReactQueryDevtools }
    })
  : null

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container not found')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <OfflineBanner>
                <App />
              </OfflineBanner>
            </AuthProvider>
            {ReactQueryDevtools ? (
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
              </Suspense>
            ) : null}
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
