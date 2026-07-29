import { Box, Button, Container, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error de aplicación:', error, info.componentStack)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth='sm'>
          <Box sx={{ textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant='h4' component='h1' sx={{ mb: 1, fontWeight: 700 }}>
              Algo salió mal
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
              Ocurrió un error inesperado. Intenta recargar la página.
            </Typography>
            <Button variant='contained' onClick={this.handleRetry} aria-label='Recargar aplicación'>
              Recargar
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }
}
