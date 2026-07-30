import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useThemeModePreference } from '@/app/ThemeModePreferenceContext'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { DealerThemeBrandingInput } from '@/shared/utils/dealerThemeUtils'
import { createDealerTheme, dealerToThemeBranding, resolveThemeMode } from '@/shared/utils/dealerThemeUtils'

interface DealerThemeProviderProps {
  children: ReactNode
  branding?: DealerThemeBrandingInput | null
  withBaseline?: boolean
}

interface DealerThemeControlsContextValue {
  paletteMode: 'light' | 'dark'
  togglePaletteMode: () => void
}

const DealerThemeControlsContext = createContext<DealerThemeControlsContextValue | null>(null)

export const DealerThemeProvider = ({
  children,
  branding,
  withBaseline = true
}: DealerThemeProviderProps) => {
  const { dealer } = useAuth()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
  const { preference, togglePreference } = useThemeModePreference()

  const resolvedBranding = useMemo<DealerThemeBrandingInput | null>(() => {
    if (branding) {
      return {
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        theme: branding.theme
      }
    }
    return dealerToThemeBranding(dealer)
  }, [branding, dealer])

  const dealerPaletteMode = useMemo(
    () => resolveThemeMode(resolvedBranding?.theme ?? null, prefersDark),
    [resolvedBranding?.theme, prefersDark]
  )

  const paletteMode = preference ?? dealerPaletteMode

  const theme = useMemo(
    () => createDealerTheme(resolvedBranding, paletteMode),
    [resolvedBranding, paletteMode]
  )

  const controls = useMemo<DealerThemeControlsContextValue>(
    () => ({
      paletteMode,
      togglePaletteMode: () => togglePreference(paletteMode)
    }),
    [paletteMode, togglePreference]
  )

  return (
    <DealerThemeControlsContext.Provider value={controls}>
      <ThemeProvider theme={theme}>
        {withBaseline ? <CssBaseline /> : null}
        {children}
      </ThemeProvider>
    </DealerThemeControlsContext.Provider>
  )
}

export const useDealerThemeControls = (): DealerThemeControlsContextValue => {
  const context = useContext(DealerThemeControlsContext)
  if (!context) {
    throw new Error('useDealerThemeControls debe usarse dentro de DealerThemeProvider')
  }
  return context
}
