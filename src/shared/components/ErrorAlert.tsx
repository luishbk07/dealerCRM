import { Alert, Button } from '@mui/material'
import { isDev } from '@/shared/utils/environment'
import { getUserFriendlyError } from '@/shared/utils/userMessages'

interface ErrorAlertProps {
  error?: unknown
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorAlert = ({
  error,
  message = 'No se pudo cargar la información.',
  onRetry,
  retryLabel = 'Reintentar'
}: ErrorAlertProps) => {
  const friendlyMessage = getUserFriendlyError(error, message)

  return (
    <Alert
      severity='error'
      sx={{ borderRadius: 2 }}
      action={
        onRetry ? (
          <Button color='inherit' size='small' onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : undefined
      }
    >
      {friendlyMessage}
      {isDev && error instanceof Error && error.message !== friendlyMessage
        ? ` (${error.message})`
        : null}
    </Alert>
  )
}
