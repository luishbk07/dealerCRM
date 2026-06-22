import { Chip, type ChipProps } from '@mui/material'
import type { LeadStatus, VehicleStatus } from '@/shared/types'

type Status = LeadStatus | VehicleStatus

interface StatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: Status
}

interface ChipDescriptor {
  label: string
  color: ChipProps['color']
}

const STATUS_MAP: Record<Status, ChipDescriptor> = {
  new: { label: 'Nuevo', color: 'info' },
  contacted: { label: 'Contactado', color: 'primary' },
  negotiating: { label: 'Negociando', color: 'warning' },
  sold: { label: 'Vendido', color: 'success' },
  lost: { label: 'Perdido', color: 'default' },
  available: { label: 'Disponible', color: 'success' },
  reserved: { label: 'Reservado', color: 'warning' }
}

export const StatusChip = ({ status, size = 'small', ...rest }: StatusChipProps) => {
  const descriptor = STATUS_MAP[status]
  return <Chip label={descriptor.label} color={descriptor.color} size={size} {...rest} />
}
