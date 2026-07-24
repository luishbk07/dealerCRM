import { Alert, Box, Card, CardContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth'
import { LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { DealerSettingsForm } from '../components/DealerSettingsForm'
import { useDealerSettings } from '../hooks/useDealerSettings'
import { useDealerSettingsMutations } from '../hooks/useDealerSettingsMutations'
import {
  getDealerSettingsUserMessage
} from '../services/dealerSettingsService'
import {
  dealerToFormValues,
  getDealerSettingsValidationMessage,
  validateDealerSettingsForm,
  type DealerSettingsFormErrors,
  type DealerSettingsFormValues
} from '../utils/dealerSettingsValidation'

export const DealerSettingsPage = () => {
  const { user, dealer: authDealer, refreshDealer } = useAuth()
  const { showToast } = useToast()
  const dealerId = authDealer?.id

  const settingsQuery = useDealerSettings(dealerId)
  const dealer = settingsQuery.data ?? authDealer

  const [values, setValues] = useState<DealerSettingsFormValues | null>(null)
  const [errors, setErrors] = useState<DealerSettingsFormErrors>({})

  const { updateProfile, uploadLogo, uploadBanner } = useDealerSettingsMutations()

  useEffect(() => {
    if (!dealer) return
    setValues((current) => current ?? dealerToFormValues(dealer, user?.email))
  }, [dealer, user?.email])

  if (!dealerId) {
    return (
      <Box>
        <PageHeader title='Configuración del Dealer' />
        <Alert severity='warning'>Completa el onboarding para acceder a la configuración.</Alert>
      </Box>
    )
  }

  if (settingsQuery.isLoading || !dealer || !values) {
    return <LoadingState message='Cargando configuración…' />
  }

  if (settingsQuery.isError) {
    return (
      <Box>
        <PageHeader title='Configuración del Dealer' />
        <Alert severity='error'>No fue posible cargar la configuración.</Alert>
      </Box>
    )
  }

  const handleSave = async () => {
    const validation = validateDealerSettingsForm(values)
    setErrors(validation.errors)
    if (!validation.valid) {
      showToast(
        getDealerSettingsValidationMessage(validation.errors) ?? 'Revisa los campos del formulario.',
        'error'
      )
      return
    }

    try {
      const updated = await updateProfile.mutateAsync({
        dealerId,
        values,
        normalizedWebsite: validation.normalizedWebsite
      })
      setValues(dealerToFormValues(updated, user?.email))
      setErrors({})
      await refreshDealer()
      showToast('Configuración actualizada correctamente.')
    } catch (error) {
      showToast(getDealerSettingsUserMessage(error), 'error')
    }
  }

  const handleUploadLogo = async (file: File) => {
    try {
      await uploadLogo.mutateAsync({
        dealerId,
        file,
        previousPath: dealer.logoPath
      })
      await refreshDealer()
      showToast('Logo actualizado correctamente.')
    } catch (error) {
      showToast(getDealerSettingsUserMessage(error), 'error')
    }
  }

  const handleUploadBanner = async (file: File) => {
    try {
      await uploadBanner.mutateAsync({
        dealerId,
        file,
        previousPath: dealer.bannerPath
      })
      await refreshDealer()
      showToast('Banner actualizado correctamente.')
    } catch (error) {
      showToast(getDealerSettingsUserMessage(error), 'error')
    }
  }

  return (
    <Box>
      <PageHeader
        title='Configuración del Dealer'
        subtitle='Administra la información pública y de contacto de tu concesionario'
      />

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <DealerSettingsForm
            dealer={dealer}
            values={values}
            errors={errors}
            saving={updateProfile.isPending}
            uploadingLogo={uploadLogo.isPending}
            uploadingBanner={uploadBanner.isPending}
            onChange={setValues}
            onSave={() => void handleSave()}
            onUploadLogo={handleUploadLogo}
            onUploadBanner={handleUploadBanner}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
