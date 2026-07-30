import type { DealerThemeMode } from '@/shared/types'
import { baseTheme } from '@/app/theme'
import {
  DEFAULT_DEALER_THEME,
  normalizeHexColor
} from '@/shared/utils/dealerThemeUtils'

export interface DealerSettingsFormValues {
  name: string
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  website: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  theme: DealerThemeMode
}

export interface DealerSettingsFormErrors {
  name?: string
  email?: string
  website?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeWebsite = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    return url.toString()
  } catch {
    return null
  }
}

export const validateDealerSettingsForm = (
  values: DealerSettingsFormValues
): { valid: boolean, errors: DealerSettingsFormErrors, normalizedWebsite: string | null } => {
  const errors: DealerSettingsFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre del concesionario es obligatorio.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido.'
  }

  const websiteInput = values.website.trim()
  let normalizedWebsite: string | null = null
  if (websiteInput) {
    normalizedWebsite = normalizeWebsite(websiteInput)
    if (!normalizedWebsite) {
      errors.website = 'Ingresa una URL válida para el sitio web.'
    }
  }

  const primaryColor = normalizeHexColor(values.primaryColor)
  if (!primaryColor) {
    errors.primaryColor = 'Ingresa un color HEX válido para el color primario.'
  }

  const secondaryColor = normalizeHexColor(values.secondaryColor)
  if (!secondaryColor) {
    errors.secondaryColor = 'Ingresa un color HEX válido para el color secundario.'
  }

  const accentColor = normalizeHexColor(values.accentColor)
  if (!accentColor) {
    errors.accentColor = 'Ingresa un color HEX válido para el color de acento.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedWebsite
  }
}

export const getDealerSettingsValidationMessage = (errors: DealerSettingsFormErrors): string | null =>
  errors.name
  ?? errors.email
  ?? errors.website
  ?? errors.primaryColor
  ?? errors.secondaryColor
  ?? errors.accentColor
  ?? null

export const dealerToFormValues = (
  dealer: {
    name: string
    email: string | null
    phone: string | null
    whatsapp: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    country: string | null
    website: string | null
    primaryColor?: string | null
    secondaryColor?: string | null
    accentColor?: string | null
    theme?: DealerThemeMode | null
  },
  fallbackEmail?: string
): DealerSettingsFormValues => ({
  name: dealer.name ?? '',
  email: dealer.email ?? fallbackEmail ?? '',
  phone: dealer.phone ?? '',
  whatsapp: dealer.whatsapp ?? '',
  address: dealer.address ?? '',
  city: dealer.city ?? '',
  state: dealer.state ?? '',
  zipCode: dealer.zipCode ?? '',
  country: dealer.country ?? '',
  website: dealer.website ?? '',
  primaryColor: dealer.primaryColor ?? baseTheme.palette.primary.main,
  secondaryColor: dealer.secondaryColor ?? baseTheme.palette.secondary.main,
  accentColor: dealer.accentColor ?? baseTheme.palette.warning.main,
  theme: dealer.theme ?? DEFAULT_DEALER_THEME
})
