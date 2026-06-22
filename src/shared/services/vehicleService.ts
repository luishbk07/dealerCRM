import type { Vehicle, VehicleInput } from '@/shared/types'
import { createId } from '@/shared/utils/id'
import { delay } from '@/shared/utils/delay'
import { storage } from './storage'
import { seedVehicles } from './seedData'

export interface VehicleService {
  list(): Promise<Vehicle[]>
  getById(id: string): Promise<Vehicle | null>
  create(input: VehicleInput): Promise<Vehicle>
  update(id: string, input: VehicleInput): Promise<Vehicle>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'vehicles'

const loadVehicles = (): Vehicle[] => storage.get<Vehicle[]>(STORAGE_KEY, seedVehicles)

const persist = (vehicles: Vehicle[]): void => storage.set(STORAGE_KEY, vehicles)

export const vehicleService: VehicleService = {
  async list() {
    await delay(120)
    return loadVehicles()
  },
  async getById(id) {
    await delay(80)
    return loadVehicles().find((vehicle) => vehicle.id === id) ?? null
  },
  async create(input) {
    await delay(150)
    const vehicles = loadVehicles()
    const timestamp = new Date().toISOString()
    const vehicle: Vehicle = {
      ...input,
      id: createId('veh'),
      status: input.status ?? 'available',
      createdAt: timestamp,
      updatedAt: timestamp
    }
    const next = [vehicle, ...vehicles]
    persist(next)
    return vehicle
  },
  async update(id, input) {
    await delay(150)
    const vehicles = loadVehicles()
    const index = vehicles.findIndex((vehicle) => vehicle.id === id)
    if (index === -1) throw new Error(`Vehicle ${id} not found`)
    const updated: Vehicle = {
      ...vehicles[index],
      ...input,
      id,
      status: input.status ?? vehicles[index].status,
      updatedAt: new Date().toISOString()
    }
    const next = [...vehicles]
    next[index] = updated
    persist(next)
    return updated
  },
  async remove(id) {
    await delay(100)
    const next = loadVehicles().filter((vehicle) => vehicle.id !== id)
    persist(next)
  }
}
