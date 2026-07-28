import { supabase } from '@/shared/services/supabase'
import type { Vehicle } from '@/shared/types'
import { mapVehicleRow, type VehicleRow } from './rowMappers'

const VEHICLE_COLUMNS = `
  id, dealer_id, brand, model, year, price, mileage, transmission, fuel_type,
  description, status, vin, stock_number, trim, body_style, exterior_color,
  interior_color, drivetrain, engine, sale_price, featured, created_at, updated_at
`

export type VehicleListSort = 'newest' | 'price_asc' | 'price_desc'

export interface VehicleListParams {
  page: number
  pageSize: number
  dealerId?: string | null
  status?: string | null
  brand?: string | null
  yearMin?: number | null
  yearMax?: number | null
  priceMin?: number | null
  priceMax?: number | null
  transmission?: string | null
  fuelType?: string | null
  search?: string | null
  sort?: VehicleListSort | null
}

export interface VehicleListResult {
  items: Vehicle[]
  total: number
  page: number
  pageSize: number
}

export interface CreateVehicleRow {
  dealer_id: string
  brand: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  transmission: string | null
  fuel_type: string | null
  description: string | null
  status: string
  vin: string | null
  stock_number: string | null
  trim: string | null
  body_style: string | null
  exterior_color: string | null
  interior_color: string | null
  drivetrain: string | null
  engine: string | null
  sale_price: number | null
  featured: boolean
}

export type UpdateVehicleRow = Partial<Omit<CreateVehicleRow, 'dealer_id'>>

export const vehicleRepository = {
  async list(params: VehicleListParams): Promise<VehicleListResult> {
    const from = params.page * params.pageSize
    const to = from + params.pageSize - 1

    let query = supabase.from('vehicles').select(VEHICLE_COLUMNS, { count: 'exact' })

    const sort = params.sort ?? 'newest'
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true, nullsFirst: false })
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false, nullsFirst: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    query = query.range(from, to)

    if (params.dealerId) query = query.eq('dealer_id', params.dealerId)
    if (params.status) query = query.eq('status', params.status)
    if (params.brand) query = query.ilike('brand', `%${params.brand}%`)
    if (params.yearMin !== null && params.yearMin !== undefined) query = query.gte('year', params.yearMin)
    if (params.yearMax !== null && params.yearMax !== undefined) query = query.lte('year', params.yearMax)
    if (params.priceMin !== null && params.priceMin !== undefined) query = query.gte('price', params.priceMin)
    if (params.priceMax !== null && params.priceMax !== undefined) query = query.lte('price', params.priceMax)
    if (params.transmission) query = query.ilike('transmission', `%${params.transmission}%`)
    if (params.fuelType) query = query.ilike('fuel_type', `%${params.fuelType}%`)
    if (params.search) {
      const term = params.search.trim()
      const pattern = `%${term}%`
      const orFilters = [`brand.ilike.${pattern}`, `model.ilike.${pattern}`, `vin.ilike.${pattern}`, `stock_number.ilike.${pattern}`]
      if (/^\d{4}$/.test(term)) {
        orFilters.push(`year.eq.${term}`)
      }
      query = query.or(orFilters.join(','))
    }

    const { data, error, count } = await query.returns<VehicleRow[]>()
    if (error) throw new Error(error.message)

    return {
      items: (data ?? []).map(mapVehicleRow),
      total: count ?? 0,
      page: params.page,
      pageSize: params.pageSize
    }
  },

  async getById(id: string): Promise<Vehicle | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .select(VEHICLE_COLUMNS)
      .eq('id', id)
      .maybeSingle<VehicleRow>()
    if (error) throw new Error(error.message)
    return data ? mapVehicleRow(data) : null
  },

  async create(payload: CreateVehicleRow): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(payload)
      .select(VEHICLE_COLUMNS)
      .single<VehicleRow>()
    if (error) throw new Error(error.message)
    return mapVehicleRow(data)
  },

  async update(id: string, patch: UpdateVehicleRow): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .update(patch)
      .eq('id', id)
      .select(VEHICLE_COLUMNS)
      .single<VehicleRow>()
    if (error) throw new Error(error.message)
    return mapVehicleRow(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
