import type { Lead, LeadMessage, LeadNote, Sale, Vehicle, VehicleImage } from '@/shared/types'

export interface VehicleRow {
  id: string
  dealer_id: string | null
  brand: string
  model: string
  year: number | null
  price: number | string | null
  mileage: number | null
  transmission: string | null
  fuel_type: string | null
  description: string | null
  status: string | null
  vin: string | null
  stock_number: string | null
  trim: string | null
  body_style: string | null
  exterior_color: string | null
  interior_color: string | null
  drivetrain: string | null
  engine: string | null
  sale_price: number | string | null
  featured: boolean | null
  created_at: string
  updated_at: string | null
}

export interface VehicleImageRow {
  id: string
  vehicle_id: string | null
  url: string
  storage_path: string | null
  position: number | null
  display_order: number | null
  is_primary: boolean | null
  created_at: string
}

export interface LeadRow {
  id: string
  dealer_id: string | null
  vehicle_id: string | null
  name: string | null
  phone: string | null
  message: string | null
  source: string | null
  status: string | null
  created_at: string
  last_contact_at: string | null
}

export interface LeadNoteRow {
  id: string
  lead_id: string | null
  note: string | null
  created_at: string
}

export interface LeadMessageRow {
  id: string
  lead_id: string | null
  sender: string | null
  message: string | null
  created_at: string
}

export interface SaleRow {
  id: string
  dealer_id: string | null
  vehicle_id: string | null
  lead_id: string | null
  price: number | string | null
  sold_at: string
}

const toNumberOrNull = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) return null
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : null
}

export const mapVehicleRow = (row: VehicleRow): Vehicle => ({
  id: row.id,
  dealerId: row.dealer_id,
  brand: row.brand,
  model: row.model,
  year: row.year,
  price: toNumberOrNull(row.price),
  mileage: row.mileage,
  transmission: row.transmission,
  fuelType: row.fuel_type,
  description: row.description,
  status: row.status ?? 'active',
  vin: row.vin,
  stockNumber: row.stock_number,
  trim: row.trim,
  bodyStyle: row.body_style,
  exteriorColor: row.exterior_color,
  interiorColor: row.interior_color,
  drivetrain: row.drivetrain,
  engine: row.engine,
  salePrice: toNumberOrNull(row.sale_price),
  featured: Boolean(row.featured),
  createdAt: row.created_at,
  updatedAt: row.updated_at ?? row.created_at
})

export const mapVehicleImageRow = (row: VehicleImageRow): VehicleImage => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  url: row.url,
  storagePath: row.storage_path,
  position: row.position,
  displayOrder: row.display_order,
  isPrimary: Boolean(row.is_primary),
  createdAt: row.created_at
})

export const mapLeadRow = (row: LeadRow): Lead => ({
  id: row.id,
  dealerId: row.dealer_id,
  vehicleId: row.vehicle_id,
  name: row.name,
  phone: row.phone,
  message: row.message,
  source: row.source,
  status: row.status ?? 'new',
  createdAt: row.created_at,
  lastContactAt: row.last_contact_at
})

export const mapLeadNoteRow = (row: LeadNoteRow): LeadNote => ({
  id: row.id,
  leadId: row.lead_id,
  note: row.note,
  createdAt: row.created_at
})

export const mapLeadMessageRow = (row: LeadMessageRow): LeadMessage => ({
  id: row.id,
  leadId: row.lead_id,
  sender: row.sender,
  message: row.message,
  createdAt: row.created_at
})

export const mapSaleRow = (row: SaleRow): Sale => ({
  id: row.id,
  dealerId: row.dealer_id,
  vehicleId: row.vehicle_id,
  leadId: row.lead_id,
  price: toNumberOrNull(row.price),
  soldAt: row.sold_at
})
