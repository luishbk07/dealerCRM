import { useCallback, useState } from 'react'
import type { Vehicle, VehicleInput, FuelType, TransmissionType, VehicleStatus } from '@/shared/types'

const currentYear = new Date().getFullYear()

const buildInitial = (vehicle?: Vehicle | null): VehicleInput => ({
  brand: vehicle?.brand ?? '',
  model: vehicle?.model ?? '',
  year: vehicle?.year ?? currentYear,
  price: vehicle?.price ?? 0,
  mileage: vehicle?.mileage ?? 0,
  transmission: vehicle?.transmission ?? 'automatic',
  fuelType: vehicle?.fuelType ?? 'gasoline',
  images: vehicle?.images ?? [],
  description: vehicle?.description ?? '',
  status: vehicle?.status ?? 'available'
})

export type VehicleFormErrors = Partial<Record<keyof VehicleInput, string>>

export const validateVehicle = (input: VehicleInput): VehicleFormErrors => {
  const errors: VehicleFormErrors = {}
  if (!input.brand.trim()) errors.brand = 'La marca es requerida'
  if (!input.model.trim()) errors.model = 'El modelo es requerido'
  if (!input.year || input.year < 1950 || input.year > currentYear + 1) errors.year = 'Año inválido'
  if (input.price <= 0) errors.price = 'El precio debe ser mayor a 0'
  if (input.mileage < 0) errors.mileage = 'El kilometraje no puede ser negativo'
  return errors
}

interface UseVehicleFormResult {
  values: VehicleInput
  errors: VehicleFormErrors
  setField: <K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => void
  setImages: (images: string[]) => void
  setTransmission: (value: TransmissionType) => void
  setFuelType: (value: FuelType) => void
  setStatus: (value: VehicleStatus) => void
  validate: () => boolean
  reset: (vehicle?: Vehicle | null) => void
}

export const useVehicleForm = (initial?: Vehicle | null): UseVehicleFormResult => {
  const [values, setValues] = useState<VehicleInput>(buildInitial(initial))
  const [errors, setErrors] = useState<VehicleFormErrors>({})

  const setField = useCallback(<K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const nextErrors = validateVehicle(values)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [values])

  const reset = useCallback((vehicle?: Vehicle | null) => {
    setValues(buildInitial(vehicle))
    setErrors({})
  }, [])

  return {
    values,
    errors,
    setField,
    setImages: (images) => setField('images', images),
    setTransmission: (value) => setField('transmission', value),
    setFuelType: (value) => setField('fuelType', value),
    setStatus: (value) => setField('status', value),
    validate,
    reset
  }
}
