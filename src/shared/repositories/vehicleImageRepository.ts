import { supabase } from '@/shared/services/supabase'
import type { VehicleImage } from '@/shared/types'
import { mapVehicleImageRow, type VehicleImageRow } from './rowMappers'

const COLUMNS = 'id, vehicle_id, url, storage_path, position, display_order, is_primary, created_at'

const ORDER_PRIMARY = { column: 'is_primary', ascending: false } as const
const ORDER_DISPLAY = { column: 'display_order', ascending: true } as const
const ORDER_POSITION = { column: 'position', ascending: true } as const
const ORDER_CREATED = { column: 'created_at', ascending: true } as const

export interface CreateVehicleImageRow {
  vehicle_id: string
  url: string
  storage_path: string | null
  display_order: number
  position: number
  is_primary: boolean
}

export const vehicleImageRepository = {
  async listByVehicleId(vehicleId: string): Promise<VehicleImage[]> {
    const { data, error } = await supabase
      .from('vehicle_images')
      .select(COLUMNS)
      .eq('vehicle_id', vehicleId)
      .order(ORDER_PRIMARY.column, { ascending: ORDER_PRIMARY.ascending })
      .order(ORDER_DISPLAY.column, { ascending: ORDER_DISPLAY.ascending })
      .order(ORDER_POSITION.column, { ascending: ORDER_POSITION.ascending })
      .order(ORDER_CREATED.column, { ascending: ORDER_CREATED.ascending })
      .returns<VehicleImageRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map(mapVehicleImageRow)
  },

  async listByVehicleIds(vehicleIds: string[]): Promise<VehicleImage[]> {
    if (vehicleIds.length === 0) return []
    const { data, error } = await supabase
      .from('vehicle_images')
      .select(COLUMNS)
      .in('vehicle_id', vehicleIds)
      .order(ORDER_PRIMARY.column, { ascending: ORDER_PRIMARY.ascending })
      .order(ORDER_DISPLAY.column, { ascending: ORDER_DISPLAY.ascending })
      .order(ORDER_POSITION.column, { ascending: ORDER_POSITION.ascending })
      .order(ORDER_CREATED.column, { ascending: ORDER_CREATED.ascending })
      .returns<VehicleImageRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map(mapVehicleImageRow)
  },

  async create(payload: CreateVehicleImageRow): Promise<VehicleImage> {
    const { data, error } = await supabase
      .from('vehicle_images')
      .insert(payload)
      .select(COLUMNS)
      .single<VehicleImageRow>()
    if (error) throw new Error(error.message)
    return mapVehicleImageRow(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('vehicle_images').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async clearPrimaryForVehicle(vehicleId: string): Promise<void> {
    const { error } = await supabase
      .from('vehicle_images')
      .update({ is_primary: false })
      .eq('vehicle_id', vehicleId)
    if (error) throw new Error(error.message)
  },

  async setPrimary(id: string): Promise<void> {
    const { error } = await supabase.from('vehicle_images').update({ is_primary: true }).eq('id', id)
    if (error) throw new Error(error.message)
  }
}
