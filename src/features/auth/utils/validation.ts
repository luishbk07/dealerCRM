export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim())

export const MIN_PASSWORD_LENGTH = 8

export interface RegisterFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>

export const validateRegisterForm = (values: RegisterFormValues): RegisterFormErrors => {
  const errors: RegisterFormErrors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'El nombre completo es requerido'
  }

  if (!values.email.trim()) {
    errors.email = 'El correo es requerido'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Ingresa un correo válido'
  }

  if (!values.password) {
    errors.password = 'La contraseña es requerida'
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
}
