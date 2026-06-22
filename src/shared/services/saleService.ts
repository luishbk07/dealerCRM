import type { Sale } from '@/shared/types'
import { delay } from '@/shared/utils/delay'
import { storage } from './storage'
import { seedSales } from './seedData'

export interface SaleService {
  list(): Promise<Sale[]>
}

const STORAGE_KEY = 'sales'

const loadSales = (): Sale[] => storage.get<Sale[]>(STORAGE_KEY, seedSales)

export const saleService: SaleService = {
  async list() {
    await delay(120)
    return loadSales()
  }
}
