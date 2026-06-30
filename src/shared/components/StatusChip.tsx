import { Chip, type ChipProps } from '@mui/material'

interface StatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: string | null | undefined
}

interface ChipDescriptor {
  label: string
  color: ChipProps['color']
}

const FALLBACK: ChipDescriptor = { label: 'Sin estado', color: 'default' }

const STATUS_MAP: Record<string, ChipDescriptor> = {
  new: { label: 'Nuevo', color: 'info' },
  contacted: { label: 'Contactado', color: 'primary' },
  qualified: { label: 'Calificado', color: 'warning' },
  negotiating: { label: 'Negociando', color: 'warning' },
  sold: { label: 'Vendido', color: 'success' },
  lost: { label: 'Perdido', color: 'default' },
  active: { label: 'Activo', color: 'success' },
  available: { label: 'Disponible', color: 'success' },
  reserved: { label: 'Reservado', color: 'warning' },
  inactive: { label: 'Inactivo', color: 'default' },
  draft: { label: 'Borrador', color: 'default' }
}

const describe = (status: string | null | undefined): ChipDescriptor => {
  if (!status) return FALLBACK
  const normalized = status.toLowerCase()
  if (STATUS_MAP[normalized]) return STATUS_MAP[normalized]
  return { label: status, color: 'default' }
}

export const StatusChip = ({ status, size = 'small', ...rest }: StatusChipProps) => {
  const descriptor = describe(status)
  return <Chip label={descriptor.label} color={descriptor.color} size={size} {...rest} />
}
