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
}

export interface DealerSettingsFormErrors {
  name?: string
  email?: string
  website?: string
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

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedWebsite
  }
}

export const getDealerSettingsValidationMessage = (errors: DealerSettingsFormErrors): string | null =>
  errors.name ?? errors.email ?? errors.website ?? null

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
  website: dealer.website ?? ''
})
