export interface DealerOnboardingFormValues {
  name: string
  phone: string
  whatsapp: string
  address: string
}

export type DealerOnboardingFormErrors = Partial<Record<keyof DealerOnboardingFormValues, string>>

export interface CreateDealerDto {
  name: string
  phone: string
  whatsapp: string
  address?: string
}

export const INITIAL_DEALER_ONBOARDING_VALUES: DealerOnboardingFormValues = {
  name: '',
  phone: '',
  whatsapp: '',
  address: ''
}

export const validateDealerOnboarding = (values: DealerOnboardingFormValues): DealerOnboardingFormErrors => {
  const errors: DealerOnboardingFormErrors = {}
  if (!values.name.trim()) errors.name = 'El nombre del negocio es requerido'
  if (!values.phone.trim()) errors.phone = 'El teléfono es requerido'
  if (!values.whatsapp.trim()) errors.whatsapp = 'El WhatsApp es requerido'
  return errors
}

export const toCreateDealerDto = (values: DealerOnboardingFormValues): CreateDealerDto => {
  const trimmedAddress = values.address.trim()
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    whatsapp: values.whatsapp.trim(),
    ...(trimmedAddress ? { address: trimmedAddress } : {})
  }
}
