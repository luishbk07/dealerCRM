import { ToastProvider } from '@/shared/hooks/useToast'
import { AppRoutes } from './routes/AppRoutes'

export const App = () => {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  )
}
