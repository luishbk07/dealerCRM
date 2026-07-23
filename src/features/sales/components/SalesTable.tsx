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
import type { Lead, Sale, Vehicle } from '@/shared/types'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'
import { formatBuyerName } from '../utils/sortSales'

interface SalesTableProps {
  sales: Sale[]
  leadsById: Map<string, Lead>
  vehiclesById: Map<string, Vehicle>
  onSelect: (sale: Sale) => void
}

export const SalesTable = ({ sales, leadsById, vehiclesById, onSelect }: SalesTableProps) => {
  const handleRowKeyDown = (event: KeyboardEvent, sale: Sale) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(sale)
    }
  }

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stack spacing={1.5} component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {sales.map((sale) => {
            const lead = sale.leadId ? leadsById.get(sale.leadId) : undefined
            const vehicle = sale.vehicleId ? vehiclesById.get(sale.vehicleId) : undefined
            return (
              <Box component='li' key={sale.id}>
                <Card variant='outlined'>
                  <CardActionArea
                    onClick={() => onSelect(sale)}
                    aria-label={`Ver venta de ${formatBuyerName(lead)}`}
                  >
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant='subtitle1' fontWeight={600} color='success.main'>
                          {formatCurrency(sale.price)}
                        </Typography>
                        <Typography variant='body2'>
                          {formatVehicleLabel(vehicle, sale.vehicleId)}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Comprador: {formatBuyerName(lead)}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatDate(sale.soldAt)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            )
          })}
        </Stack>
      </Box>

      <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table aria-label='Lista de ventas'>
          <TableHead>
            <TableRow>
              <TableCell>Vehículo</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Comprador</TableCell>
              <TableCell>Fecha de venta</TableCell>
              <TableCell align='right'>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => {
              const lead = sale.leadId ? leadsById.get(sale.leadId) : undefined
              const vehicle = sale.vehicleId ? vehiclesById.get(sale.vehicleId) : undefined
              return (
                <TableRow
                  key={sale.id}
                  hover
                  tabIndex={0}
                  role='button'
                  aria-label={`Ver venta de ${formatBuyerName(lead)}`}
                  onClick={() => onSelect(sale)}
                  onKeyDown={(event) => handleRowKeyDown(event, sale)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant='body2' fontWeight={600}>
                      {formatVehicleLabel(vehicle, sale.vehicleId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {lead?.phone ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatBuyerName(lead)}</TableCell>
                  <TableCell>{formatDate(sale.soldAt)}</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(sale.price)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
