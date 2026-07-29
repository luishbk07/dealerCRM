import { Alert } from '@mui/material'

interface OverdueTasksBannerProps {
  show: boolean
}

export const OverdueTasksBanner = ({ show }: OverdueTasksBannerProps) => {
  if (!show) return null

  return (
    <Alert severity='warning' sx={{ borderRadius: 2 }}>
      Tienes seguimientos pendientes.
    </Alert>
  )
}
