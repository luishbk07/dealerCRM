import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { isLeadStatus } from '@/modules/leads/constants/leadStatus'
import type { LeadSearchParams } from '@/modules/leads/types'
import { queryKeys } from '@/shared/queryKeys'
import { leadService } from '../services/leadService'
import { endOfDayIso, startOfDayIso } from '../utils/leadDates'
import { sortLeads, type LeadSortOption } from '../utils/sortLeads'

const SEARCH_FETCH_SIZE = 5000

export interface LeadsListFilters {
  search: string
  status: string
  vehicleId: string
  dateFrom: string
  dateTo: string
  sort: LeadSortOption
  page: number
  pageSize: number
}

const hasActiveSearchParams = (filters: LeadsListFilters): boolean =>
  Boolean(
    filters.search.trim() ||
      (filters.status && filters.status !== 'all') ||
      filters.vehicleId ||
      filters.dateFrom ||
      filters.dateTo
  )

const toSearchParams = (filters: LeadsListFilters): LeadSearchParams => ({
  page: 0,
  pageSize: SEARCH_FETCH_SIZE,
  search: filters.search.trim() || null,
  status: filters.status !== 'all' && isLeadStatus(filters.status) ? filters.status : null,
  vehicleId: filters.vehicleId || null,
  dateFrom: filters.dateFrom ? startOfDayIso(filters.dateFrom) : null,
  dateTo: filters.dateTo ? endOfDayIso(filters.dateTo) : null
})

export const useLeadsList = (filters: LeadsListFilters) => {
  const useSearch = hasActiveSearchParams(filters)
  const searchParams = toSearchParams(filters)

  const allQuery = useQuery({
    queryKey: queryKeys.leads.allLeads,
    queryFn: () => leadService.getAll(),
    enabled: !useSearch,
    placeholderData: keepPreviousData
  })

  const searchQuery = useQuery({
    queryKey: queryKeys.leads.search(searchParams),
    queryFn: () => leadService.search(searchParams),
    enabled: useSearch,
    placeholderData: keepPreviousData
  })

  const result = useMemo(() => {
    const sourceItems = useSearch ? (searchQuery.data?.items ?? []) : (allQuery.data ?? [])
    const sorted = sortLeads(sourceItems, filters.sort)
    const total = useSearch ? (searchQuery.data?.total ?? sorted.length) : sorted.length
    const start = filters.page * filters.pageSize
    const items = sorted.slice(start, start + filters.pageSize)

    return { items, total }
  }, [
    useSearch,
    searchQuery.data,
    allQuery.data,
    filters.sort,
    filters.page,
    filters.pageSize
  ])

  return {
    ...result,
    isLoading: useSearch ? searchQuery.isLoading : allQuery.isLoading,
    isError: useSearch ? searchQuery.isError : allQuery.isError,
    error: useSearch ? searchQuery.error : allQuery.error,
    isFetching: useSearch ? searchQuery.isFetching : allQuery.isFetching,
    hasActiveFilters: useSearch
  }
}
