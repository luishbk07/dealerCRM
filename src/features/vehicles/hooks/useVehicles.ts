import { useCallback } from 'react'
import { vehicleService } from '@/shared/services'
import { useAsync } from '@/shared/hooks/useAsync'
import type { Vehicle, VehicleInput } from '@/shared/types'

export const useVehicles = () => {
  const { data, loading, error, refresh, setData } = useAsync<Vehicle[]>(() => vehicleService.list())

  const createVehicle = useCallback(async (input: VehicleInput): Promise<Vehicle> => {
    const created = await vehicleService.create(input)
    setData([created, ...(data ?? [])])
    return created
  }, [data, setData])

  const updateVehicle = useCallback(async (id: string, input: VehicleInput): Promise<Vehicle> => {
    const updated = await vehicleService.update(id, input)
    setData((data ?? []).map((vehicle) => (vehicle.id === id ? updated : vehicle)))
    return updated
  }, [data, setData])

  const removeVehicle = useCallback(async (id: string): Promise<void> => {
    await vehicleService.remove(id)
    setData((data ?? []).filter((vehicle) => vehicle.id !== id))
  }, [data, setData])

  return {
    vehicles: data ?? [],
    loading,
    error,
    refresh,
    createVehicle,
    updateVehicle,
    removeVehicle
  }
}
