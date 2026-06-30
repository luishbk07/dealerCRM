export interface VehicleFieldOption {
  value: string
  label: string
}

const withPlaceholder = (options: VehicleFieldOption[]): VehicleFieldOption[] => [
  { value: '', label: 'Seleccionar…' },
  ...options
]

export const TRANSMISSION_OPTIONS = withPlaceholder([
  { value: 'automatic', label: 'Automática' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
  { value: 'semi_automatic', label: 'Semi-automática' }
])

export const FUEL_TYPE_OPTIONS = withPlaceholder([
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'flex', label: 'Flex (gasolina/GLP)' }
])

export const BODY_STYLE_OPTIONS = withPlaceholder([
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'crossover', label: 'Crossover' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pick-up' },
  { value: 'coupe', label: 'Coupé' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Station wagon' },
  { value: 'van', label: 'Van / Minivan' }
])

export const DRIVETRAIN_OPTIONS = withPlaceholder([
  { value: 'fwd', label: 'Tracción delantera (FWD)' },
  { value: 'rwd', label: 'Tracción trasera (RWD)' },
  { value: 'awd', label: 'Tracción integral (AWD)' },
  { value: '4wd', label: '4x4' }
])

export const mergeWithCurrentValue = (
  options: VehicleFieldOption[],
  current: string
): VehicleFieldOption[] => {
  const trimmed = current.trim()
  if (!trimmed || options.some((option) => option.value === trimmed)) {
    return options
  }
  return [{ value: trimmed, label: trimmed }, ...options]
}
