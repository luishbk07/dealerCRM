import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import { publicDealerService } from '../services/publicDealerService'
import type { PublicLeadInquiryInput } from '../types'

const invalidateCrmQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.leads.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.snapshot })
  queryClient.invalidateQueries({ queryKey: ['activity'] })
}

export const usePublicLeadInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: PublicLeadInquiryInput) => publicDealerService.submitVehicleInquiry(input),
    onSuccess: () => {
      invalidateCrmQueries(queryClient)
    }
  })
}
