import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { salesService } from '../services/salesService'
import { queryKeys } from '@/shared/queryKeys'
import type { Lead, Vehicle } from '@/shared/types'
import { filterSales, type SalesFilterParams } from '../utils/filterSales'
import { sortSales, type SaleSortOption } from '../utils/sortSales'

export interface SalesListFilters extends SalesFilterParams {
  sort: SaleSortOption
  page: number
  pageSize: number
}

interface UseSalesListOptions {
  leadsById: Map<string, Lead>
  vehiclesById: Map<string, Vehicle>
}

export const useSalesList = (filters: SalesListFilters, catalog: UseSalesListOptions) => {
  const query = useQuery({
    queryKey: queryKeys.sales.allSales,
    queryFn: () => salesService.getAll(),
    placeholderData: keepPreviousData
  })

  const result = useMemo(() => {
    const source = query.data ?? []
    const filtered = filterSales(
      source,
      {
        search: filters.search,
        vehicleId: filters.vehicleId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      },
      catalog.leadsById,
      catalog.vehiclesById
    )
    const sorted = sortSales(filtered, filters.sort, catalog.leadsById)
    const total = sorted.length
    const start = filters.page * filters.pageSize
    const items = sorted.slice(start, start + filters.pageSize)

    return { items, total }
  }, [query.data, filters, catalog.leadsById, catalog.vehiclesById])

  return {
    ...result,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching
  }
}
