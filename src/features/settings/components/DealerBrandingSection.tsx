import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/shared/components'
import type { Dealer, DealerThemeMode } from '@/shared/types'
import {
  DEFAULT_DEALER_ACCENT_COLOR,
  DEFAULT_DEALER_PRIMARY_COLOR,
  DEFAULT_DEALER_SECONDARY_COLOR,
  DEFAULT_DEALER_THEME,
  resolveThemeMode
} from '@/shared/utils/dealerThemeUtils'
import { dealerSettingsService } from '../services/dealerSettingsService'
import type { DealerSettingsFormErrors, DealerSettingsFormValues } from '../utils/dealerSettingsValidation'
import { DealerBrandingPreview } from './DealerBrandingPreview'
import { DealerColorField } from './DealerColorField'
import { DealerImageUpload } from './DealerImageUpload'

interface DealerBrandingSectionProps {
  dealer: Dealer
  values: DealerSettingsFormValues
  errors: DealerSettingsFormErrors
  uploadingLogo?: boolean
  uploadingBanner?: boolean
  onChange: (values: DealerSettingsFormValues) => void
  onUploadLogo: (file: File) => Promise<void>
  onUploadBanner: (file: File) => Promise<void>
}

const THEME_OPTIONS: Array<{ value: DealerThemeMode, label: string }> = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Automático' }
]

export const DealerBrandingSection = ({
  dealer,
  values,
  errors,
  uploadingLogo,
  uploadingBanner,
  onChange,
  onUploadLogo,
  onUploadBanner
}: DealerBrandingSectionProps) => {
  const [resetOpen, setResetOpen] = useState(false)

  const logoUrl = dealerSettingsService.resolveLogoUrl(dealer.logoPath)
  const bannerUrl = dealerSettingsService.resolveBannerUrl(dealer.bannerPath)

  const previewBackground = useMemo(() => {
    const mode = resolveThemeMode(values.theme, false)
    return mode === 'dark' ? '#0f172a' : '#ffffff'
  }, [values.theme])

  const setField = <K extends keyof DealerSettingsFormValues>(key: K, value: DealerSettingsFormValues[K]) => {
    onChange({ ...values, [key]: value })
  }

  const handleResetConfirm = () => {
    onChange({
      ...values,
      primaryColor: DEFAULT_DEALER_PRIMARY_COLOR,
      secondaryColor: DEFAULT_DEALER_SECONDARY_COLOR,
      accentColor: DEFAULT_DEALER_ACCENT_COLOR,
      theme: DEFAULT_DEALER_THEME
    })
    setResetOpen(false)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant='h6' sx={{ mb: 0.5 }}>
          Marca del concesionario
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Personaliza la identidad visual de tu CRM y sitio público.
        </Typography>
      </Box>

      <DealerImageUpload
        label='Logo'
        helperText='Formato recomendado: cuadrado, PNG o JPG.'
        imageUrl={logoUrl}
        uploading={uploadingLogo}
        aspectRatio='1 / 1'
        onUpload={onUploadLogo}
      />

      <DealerImageUpload
        label='Banner'
        helperText='Imagen horizontal para tu perfil público.'
        imageUrl={bannerUrl}
        uploading={uploadingBanner}
        aspectRatio='16 / 5'
        onUpload={onUploadBanner}
      />

      <Stack spacing={2.5}>
        <DealerColorField
          label='Color primario'
          value={values.primaryColor}
          onChange={(next) => setField('primaryColor', next)}
          error={errors.primaryColor}
          previewBackground={previewBackground}
        />
        <DealerColorField
          label='Color secundario'
          value={values.secondaryColor}
          onChange={(next) => setField('secondaryColor', next)}
          error={errors.secondaryColor}
          previewBackground={previewBackground}
        />
        <DealerColorField
          label='Color de acento'
          value={values.accentColor}
          onChange={(next) => setField('accentColor', next)}
          error={errors.accentColor}
          previewBackground={previewBackground}
        />
      </Stack>

      <FormControl fullWidth size='small'>
        <InputLabel id='dealer-theme-label'>Tema</InputLabel>
        <Select
          labelId='dealer-theme-label'
          label='Tema'
          value={values.theme}
          onChange={(event) => setField('theme', event.target.value as DealerThemeMode)}
        >
          {THEME_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Aplica al panel y al sitio público de tu concesionario.</FormHelperText>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant='outlined'
          color='inherit'
          startIcon={<RestartAltIcon />}
          onClick={() => setResetOpen(true)}
        >
          Restablecer colores
        </Button>
      </Box>

      <DealerBrandingPreview
        dealerName={values.name || dealer.name}
        logoUrl={logoUrl}
        primaryColor={values.primaryColor}
        secondaryColor={values.secondaryColor}
        accentColor={values.accentColor}
        theme={values.theme}
      />

      <Divider />

      <ConfirmDialog
        open={resetOpen}
        title='Restablecer colores'
        description='Se restaurarán los colores y el tema predeterminados. Debes guardar los cambios para aplicarlos.'
        confirmLabel='Restablecer'
        destructive
        onConfirm={handleResetConfirm}
        onCancel={() => setResetOpen(false)}
      />
    </Stack>
  )
}
