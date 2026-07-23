import { type KeyboardEvent } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import type { Lead, Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatDate, formatDateTime } from '@/shared/utils/format'
import { formatVehicleLabel } from '../utils/vehicleLabel'

interface LeadsTableProps {
  leads: Lead[]
  vehiclesById: Map<string, Vehicle>
  onSelect: (lead: Lead) => void
}

export const LeadsTable = ({ leads, vehiclesById, onSelect }: LeadsTableProps) => {
  const handleRowKeyDown = (event: KeyboardEvent, lead: Lead) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(lead)
    }
  }

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stack spacing={1.5} component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {leads.map((lead) => (
            <Box component='li' key={lead.id}>
              <Card variant='outlined'>
                <CardActionArea
                  onClick={() => onSelect(lead)}
                  aria-label={`Ver lead de ${lead.name ?? 'cliente sin nombre'}`}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={1}>
                        <Typography variant='subtitle1' fontWeight={600}>
                          {lead.name ?? 'Sin nombre'}
                        </Typography>
                        <StatusChip status={lead.status} />
                      </Stack>
                      <Typography variant='body2' color='text.secondary'>
                        {lead.phone ?? '—'}
                      </Typography>
                      <Typography variant='body2'>
                        {formatVehicleLabel(
                          lead.vehicleId ? vehiclesById.get(lead.vehicleId) : undefined,
                          lead.vehicleId
                        )}
                      </Typography>
                      <Stack direction='row' justifyContent='space-between' flexWrap='wrap' gap={1}>
                        <Typography variant='caption' color='text.secondary'>
                          Origen: {lead.source ?? '—'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Creado: {formatDate(lead.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography variant='caption' color='text.secondary'>
                        Último contacto: {lead.lastContactAt ? formatDateTime(lead.lastContactAt) : '—'}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>

      <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table aria-label='Lista de leads'>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Origen</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creación</TableCell>
              <TableCell>Último contacto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                hover
                tabIndex={0}
                role='button'
                aria-label={`Ver lead de ${lead.name ?? 'cliente sin nombre'}`}
                onClick={() => onSelect(lead)}
                onKeyDown={(event) => handleRowKeyDown(event, lead)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Typography variant='body2' fontWeight={600}>
                    {lead.name ?? 'Sin nombre'}
                  </Typography>
                </TableCell>
                <TableCell>{lead.phone ?? '—'}</TableCell>
                <TableCell>
                  {formatVehicleLabel(
                    lead.vehicleId ? vehiclesById.get(lead.vehicleId) : undefined,
                    lead.vehicleId
                  )}
                </TableCell>
                <TableCell>{lead.source ?? '—'}</TableCell>
                <TableCell>
                  <StatusChip status={lead.status} />
                </TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>{lead.lastContactAt ? formatDateTime(lead.lastContactAt) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
