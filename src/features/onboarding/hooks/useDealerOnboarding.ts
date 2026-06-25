import { useCallback, useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { dealerService } from '../services/dealerService'
import {
  INITIAL_DEALER_ONBOARDING_VALUES,
  toCreateDealerDto,
  validateDealerOnboarding,
  type DealerOnboardingFormErrors,
  type DealerOnboardingFormValues
} from '../types/dealerOnboarding'
import type { Dealer } from '@/shared/types'

interface UseDealerOnboardingResult {
  values: DealerOnboardingFormValues
  errors: DealerOnboardingFormErrors
  submitting: boolean
  error: string | null
  setField: <K extends keyof DealerOnboardingFormValues>(field: K, value: DealerOnboardingFormValues[K]) => void
  submit: () => Promise<Dealer | null>
}

const NOT_AUTHENTICATED = 'Tu sesión expiró, vuelve a iniciar sesión.'

export const useDealerOnboarding = (): UseDealerOnboardingResult => {
  const { user, refreshDealer } = useAuth()
  const [values, setValues] = useState<DealerOnboardingFormValues>(INITIAL_DEALER_ONBOARDING_VALUES)
  const [errors, setErrors] = useState<DealerOnboardingFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = useCallback(<K extends keyof DealerOnboardingFormValues>(
    field: K,
    value: DealerOnboardingFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setError(null)
  }, [])

  const submit = useCallback(async (): Promise<Dealer | null> => {
    const nextErrors = validateDealerOnboarding(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return null

    if (!user) {
      setError(NOT_AUTHENTICATED)
      return null
    }

    setSubmitting(true)
    setError(null)
    try {
      const dealer = await dealerService.createDealer(user.id, toCreateDealerDto(values))
      await refreshDealer()
      return dealer
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setSubmitting(false)
    }
  }, [user, values, refreshDealer])

  return { values, errors, submitting, error, setField, submit }
}
