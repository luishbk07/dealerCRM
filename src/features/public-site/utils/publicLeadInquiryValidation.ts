export interface PublicLeadInquiryFormValues {
  name: string
  phone: string
  email: string
  message: string
  acceptedContact: boolean
}

export const DEFAULT_PUBLIC_LEAD_MESSAGE = 'Hola, estoy interesado en este vehículo.'

export const INITIAL_PUBLIC_LEAD_INQUIRY_FORM: PublicLeadInquiryFormValues = {
  name: '',
  phone: '',
  email: '',
  message: DEFAULT_PUBLIC_LEAD_MESSAGE,
  acceptedContact: false
}

export interface PublicLeadInquiryValidationErrors {
  name?: string
  phone?: string
  acceptedContact?: string
}

export const validatePublicLeadInquiry = (
  values: PublicLeadInquiryFormValues
): PublicLeadInquiryValidationErrors => {
  const errors: PublicLeadInquiryValidationErrors = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio.'
  }

  if (!values.acceptedContact) {
    errors.acceptedContact = 'Debes aceptar ser contactado por el concesionario.'
  }

  return errors
}

export const buildPublicLeadMessage = (message: string, email?: string): string | null => {
  const trimmedMessage = message.trim()
  const trimmedEmail = email?.trim()

  if (trimmedEmail) {
    const emailLine = `Correo: ${trimmedEmail}`
    return trimmedMessage ? `${trimmedMessage}\n\n${emailLine}` : emailLine
  }

  return trimmedMessage || null
}
