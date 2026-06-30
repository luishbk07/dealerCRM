import { useCallback, useState } from 'react'
import type { VehicleWithImages } from '@/shared/types'
import type { VehicleFormPayload } from '../services/vehicleService'

const currentYear = new Date().getFullYear()

export interface VehicleFormValues {
  brand: string
  model: string
  year: string
  price: string
  salePrice: string
  mileage: string
  transmission: string
  fuelType: string
  description: string
  status: string
  vin: string
  stockNumber: string
  trim: string
  bodyStyle: string
  exteriorColor: string
  interiorColor: string
  drivetrain: string
  engine: string
  featured: boolean
}

export type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>

const EMPTY_VALUES: VehicleFormValues = {
  brand: '',
  model: '',
  year: `${currentYear}`,
  price: '',
  salePrice: '',
  mileage: '',
  transmission: '',
  fuelType: '',
  description: '',
  status: 'active',
  vin: '',
  stockNumber: '',
  trim: '',
  bodyStyle: '',
  exteriorColor: '',
  interiorColor: '',
  drivetrain: '',
  engine: '',
  featured: false
}

const numberOrNull = (value: string): number | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

const stringOrNull = (value: string): string | null => {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const fromVehicle = (vehicle?: VehicleWithImages | null): VehicleFormValues => {
  if (!vehicle) return EMPTY_VALUES
  return {
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year !== null ? `${vehicle.year}` : '',
    price: vehicle.price !== null ? `${vehicle.price}` : '',
    salePrice: vehicle.salePrice !== null ? `${vehicle.salePrice}` : '',
    mileage: vehicle.mileage !== null ? `${vehicle.mileage}` : '',
    transmission: vehicle.transmission ?? '',
    fuelType: vehicle.fuelType ?? '',
    description: vehicle.description ?? '',
    status: vehicle.status ?? 'active',
    vin: vehicle.vin ?? '',
    stockNumber: vehicle.stockNumber ?? '',
    trim: vehicle.trim ?? '',
    bodyStyle: vehicle.bodyStyle ?? '',
    exteriorColor: vehicle.exteriorColor ?? '',
    interiorColor: vehicle.interiorColor ?? '',
    drivetrain: vehicle.drivetrain ?? '',
    engine: vehicle.engine ?? '',
    featured: vehicle.featured
  }
}

export const validateVehicleForm = (values: VehicleFormValues): VehicleFormErrors => {
  const errors: VehicleFormErrors = {}
  if (!values.brand.trim()) errors.brand = 'La marca es requerida'
  if (!values.model.trim()) errors.model = 'El modelo es requerido'
  if (values.year) {
    const year = Number(values.year)
    if (!Number.isFinite(year) || year < 1950 || year > currentYear + 1) {
      errors.year = 'Año inválido'
    }
  }
  if (values.price) {
    const price = Number(values.price)
    if (!Number.isFinite(price) || price < 0) errors.price = 'Precio inválido'
  }
  if (values.mileage) {
    const mileage = Number(values.mileage)
    if (!Number.isFinite(mileage) || mileage < 0) errors.mileage = 'Kilometraje inválido'
  }
  if (!values.status.trim()) errors.status = 'El estado es requerido'
  return errors
}

export const toFormPayload = (values: VehicleFormValues): VehicleFormPayload => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  year: numberOrNull(values.year),
  price: numberOrNull(values.price),
  salePrice: numberOrNull(values.salePrice),
  mileage: numberOrNull(values.mileage),
  transmission: stringOrNull(values.transmission),
  fuelType: stringOrNull(values.fuelType),
  description: stringOrNull(values.description),
  status: values.status.trim() || 'active',
  vin: stringOrNull(values.vin),
  stockNumber: stringOrNull(values.stockNumber),
  trim: stringOrNull(values.trim),
  bodyStyle: stringOrNull(values.bodyStyle),
  exteriorColor: stringOrNull(values.exteriorColor),
  interiorColor: stringOrNull(values.interiorColor),
  drivetrain: stringOrNull(values.drivetrain),
  engine: stringOrNull(values.engine),
  featured: values.featured
})

export interface UseVehicleFormResult {
  values: VehicleFormValues
  errors: VehicleFormErrors
  setField: <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => void
  validate: () => boolean
  reset: (vehicle?: VehicleWithImages | null) => void
}

export const useVehicleForm = (initial?: VehicleWithImages | null): UseVehicleFormResult => {
  const [values, setValues] = useState<VehicleFormValues>(fromVehicle(initial))
  const [errors, setErrors] = useState<VehicleFormErrors>({})

  const setField = useCallback(<K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const next = validateVehicleForm(values)
    setErrors(next)
    return Object.keys(next).length === 0
  }, [values])

  const reset = useCallback((vehicle?: VehicleWithImages | null) => {
    setValues(fromVehicle(vehicle))
    setErrors({})
  }, [])

  return { values, errors, setField, validate, reset }
}
