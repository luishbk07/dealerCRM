import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import { dealerSettingsService } from '../services/dealerSettingsService'
import type { DealerSettingsFormValues } from '../utils/dealerSettingsValidation'

interface UpdateProfileVars {
  dealerId: string
  values: DealerSettingsFormValues
  normalizedWebsite: string | null
}

interface UploadImageVars {
  dealerId: string
  file: File
  previousPath: string | null
}

export const useDealerSettingsMutations = () => {
  const queryClient = useQueryClient()

  const invalidate = (dealerId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dealer.settings(dealerId) })
  }

  const updateProfile = useMutation({
    mutationFn: ({ dealerId, values, normalizedWebsite }: UpdateProfileVars) =>
      dealerSettingsService.updateProfile(dealerId, values, normalizedWebsite),
    onSuccess: (dealer) => invalidate(dealer.id)
  })

  const uploadLogo = useMutation({
    mutationFn: ({ dealerId, file, previousPath }: UploadImageVars) =>
      dealerSettingsService.uploadLogo(dealerId, file, previousPath),
    onSuccess: (dealer) => invalidate(dealer.id)
  })

  const uploadBanner = useMutation({
    mutationFn: ({ dealerId, file, previousPath }: UploadImageVars) =>
      dealerSettingsService.uploadBanner(dealerId, file, previousPath),
    onSuccess: (dealer) => invalidate(dealer.id)
  })

  return { updateProfile, uploadLogo, uploadBanner }
}
