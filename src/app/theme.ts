import { createTheme } from '@mui/material/styles'

export const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#0F172A',
      light: '#334155',
      dark: '#020617'
    },
    success: {
      main: '#10B981'
    },
    warning: {
      main: '#F59E0B'
    },
    error: {
      main: '#EF4444'
    },
    info: {
      main: '#0EA5E9'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569'
    },
    divider: '#E2E8F0'
  },
  typography: {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent'
      },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: 8
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E2E8F0'
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          borderRadius: 12
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#475569',
          backgroundColor: '#F8FAFC'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    }
  }
})

export const theme = baseTheme
