import { useCallback, useState } from 'react'
import type { DealerInput } from '@/shared/types'

const INITIAL_VALUES: DealerInput = {
  name: '',
  phone: '',
  address: '',
  city: '',
  logoUrl: ''
}

export type DealerFormErrors = Partial<Record<keyof DealerInput, string>>

export const validateDealerInput = (values: DealerInput): DealerFormErrors => {
  const errors: DealerFormErrors = {}
  if (!values.name.trim()) errors.name = 'El nombre del concesionario es requerido'
  return errors
}

const normalize = (values: DealerInput): DealerInput => ({
  name: values.name.trim(),
  phone: values.phone?.trim() || undefined,
  address: values.address?.trim() || undefined,
  city: values.city?.trim() || undefined,
  logoUrl: values.logoUrl?.trim() || undefined
})

export const useDealerForm = (initial?: Partial<DealerInput>) => {
  const [values, setValues] = useState<DealerInput>({ ...INITIAL_VALUES, ...initial })
  const [errors, setErrors] = useState<DealerFormErrors>({})

  const setField = useCallback(<K extends keyof DealerInput>(field: K, value: DealerInput[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): { valid: boolean, payload: DealerInput } => {
    const next = validateDealerInput(values)
    setErrors(next)
    return { valid: Object.keys(next).length === 0, payload: normalize(values) }
  }, [values])

  return { values, errors, setField, validate }
}
