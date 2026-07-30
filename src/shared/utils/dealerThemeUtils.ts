import { createTheme, getContrastRatio as muiGetContrastRatio, type PaletteColorOptions, type Theme } from '@mui/material/styles'
import { baseTheme } from '@/app/theme'
import type { DealerBranding, DealerThemeMode } from '@/shared/types'

export const DEFAULT_DEALER_PRIMARY_COLOR = '#1976d2'
export const DEFAULT_DEALER_SECONDARY_COLOR = '#9c27b0'
export const DEFAULT_DEALER_ACCENT_COLOR = '#ff9800'
export const DEFAULT_DEALER_THEME: DealerThemeMode = 'light'

const HEX_PATTERN = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/

const expandShortHex = (hex: string): string => {
  if (hex.length !== 4) return hex
  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
}

export const normalizeHexColor = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  const normalized = withHash.length === 4 ? expandShortHex(withHash) : withHash
  return HEX_PATTERN.test(normalized) ? normalized.toLowerCase() : null
}

export const isValidHexColor = (value: string): boolean => normalizeHexColor(value) !== null

const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  const normalized = normalizeHexColor(hex)
  if (!normalized) return null
  const raw = normalized.slice(1)
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16)
  }
}

const channelToHex = (channel: number): string => {
  const clamped = Math.max(0, Math.min(255, Math.round(channel)))
  return clamped.toString(16).padStart(2, '0')
}

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`

const mixHex = (hex: string, target: 'white' | 'black', amount: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const targetRgb = target === 'white' ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 }
  return rgbToHex(
    rgb.r + (targetRgb.r - rgb.r) * amount,
    rgb.g + (targetRgb.g - rgb.g) * amount,
    rgb.b + (targetRgb.b - rgb.b) * amount
  )
}

const getRelativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const transform = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }
  const r = transform(rgb.r)
  const g = transform(rgb.g)
  const b = transform(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastRatio = (foreground: string, background: string): number => {
  const fg = getRelativeLuminance(foreground)
  const bg = getRelativeLuminance(background)
  const lighter = Math.max(fg, bg)
  const darker = Math.min(fg, bg)
  return (lighter + 0.05) / (darker + 0.05)
}

export const getContrastWarning = (
  color: string,
  background: string,
  minRatio = 4.5
): string | null => {
  const normalized = normalizeHexColor(color)
  if (!normalized) return null
  const ratio = getContrastRatio(normalized, background)
  if (ratio >= minRatio) return null
  return `Contraste bajo (${ratio.toFixed(1)}:1) sobre fondo ${background === '#ffffff' ? 'claro' : 'oscuro'}.`
}

export const getContrastText = (background: string): string => {
  const normalized = normalizeHexColor(background)
  if (!normalized) return '#ffffff'
  const whiteRatio = muiGetContrastRatio(normalized, '#ffffff')
  const blackRatio = muiGetContrastRatio(normalized, '#000000')
  return whiteRatio >= blackRatio ? '#ffffff' : '#000000'
}

const buildPaletteColor = (main: string): PaletteColorOptions => ({
  main,
  light: mixHex(main, 'white', 0.25),
  dark: mixHex(main, 'black', 0.2),
  contrastText: getContrastText(main)
})

const buildBrandedComponents = (palette: Theme['palette']) => ({
  MuiButton: {
    styleOverrides: {
      containedPrimary: {
        color: palette.primary.contrastText,
        '&:hover': {
          color: palette.primary.contrastText
        }
      },
      containedSecondary: {
        color: palette.secondary.contrastText,
        '&:hover': {
          color: palette.secondary.contrastText
        }
      },
      containedSuccess: {
        color: palette.success.contrastText,
        '&:hover': {
          color: palette.success.contrastText
        }
      },
      containedWarning: {
        color: palette.warning.contrastText,
        '&:hover': {
          color: palette.warning.contrastText
        }
      }
    }
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          '& .MuiListItemIcon-root': {
            color: palette.primary.contrastText
          },
          '&:hover': {
            backgroundColor: palette.primary.dark
          }
        }
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      filledPrimary: {
        color: palette.primary.contrastText
      },
      filledSecondary: {
        color: palette.secondary.contrastText
      },
      filledSuccess: {
        color: palette.success.contrastText
      },
      filledWarning: {
        color: palette.warning.contrastText
      },
      filledInfo: {
        color: palette.info.contrastText
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText
      },
      colorDefault: {
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText
      }
    }
  },
  MuiLinearProgress: {
    styleOverrides: {
      barColorPrimary: {
        backgroundColor: palette.primary.main
      }
    }
  }
})

export const resolveThemeMode = (
  themeMode: DealerThemeMode | null | undefined,
  prefersDark: boolean
): 'light' | 'dark' => {
  if (themeMode === 'dark') return 'dark'
  if (themeMode === 'system') return prefersDark ? 'dark' : 'light'
  return 'light'
}

export type DealerThemeBrandingInput = Pick<
  DealerBranding,
  'primaryColor' | 'secondaryColor' | 'accentColor' | 'theme'
>

export const createDealerTheme = (
  branding: DealerThemeBrandingInput | null | undefined,
  mode: 'light' | 'dark'
): Theme => {
  const primary = normalizeHexColor(branding?.primaryColor ?? '')
  const secondary = normalizeHexColor(branding?.secondaryColor ?? '')
  const accent = normalizeHexColor(branding?.accentColor ?? '')

  const paletteOverrides: Record<string, PaletteColorOptions> = {}
  if (primary) paletteOverrides.primary = buildPaletteColor(primary)
  if (secondary) paletteOverrides.secondary = buildPaletteColor(secondary)
  if (accent) {
    const accentPalette = buildPaletteColor(accent)
    paletteOverrides.success = accentPalette
    paletteOverrides.warning = accentPalette
  }
  if (primary) {
    paletteOverrides.info = buildPaletteColor(mixHex(primary, 'white', 0.15))
  }

  if (Object.keys(paletteOverrides).length === 0 && mode === 'light') {
    return baseTheme
  }

  const theme = createTheme(baseTheme, {
    palette: {
      mode,
      ...paletteOverrides,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#0f172a',
              paper: '#1e293b'
            },
            text: {
              primary: '#f8fafc',
              secondary: '#cbd5e1'
            },
            divider: '#334155'
          }
        : {})
    }
  })

  return createTheme(theme, {
    components: buildBrandedComponents(theme.palette)
  })
}

export const dealerToThemeBranding = (
  dealer: DealerThemeBrandingInput | null | undefined
): DealerThemeBrandingInput | null => {
  if (!dealer) return null
  return {
    primaryColor: dealer.primaryColor,
    secondaryColor: dealer.secondaryColor,
    accentColor: dealer.accentColor,
    theme: dealer.theme
  }
}

export const getDefaultBrandingFormValues = () => ({
  primaryColor: DEFAULT_DEALER_PRIMARY_COLOR,
  secondaryColor: DEFAULT_DEALER_SECONDARY_COLOR,
  accentColor: DEFAULT_DEALER_ACCENT_COLOR,
  theme: DEFAULT_DEALER_THEME
})
