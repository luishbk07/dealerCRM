import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import SaveIcon from '@mui/icons-material/Save'
import type { Dealer } from '@/shared/types'
import { dealerSettingsService } from '../services/dealerSettingsService'
import type { DealerSettingsFormErrors, DealerSettingsFormValues } from '../utils/dealerSettingsValidation'
import { DealerImageUpload } from './DealerImageUpload'

interface DealerSettingsFormProps {
  dealer: Dealer
  values: DealerSettingsFormValues
  errors: DealerSettingsFormErrors
  saving?: boolean
  uploadingLogo?: boolean
  uploadingBanner?: boolean
  onChange: (values: DealerSettingsFormValues) => void
  onSave: () => void
  onUploadLogo: (file: File) => Promise<void>
  onUploadBanner: (file: File) => Promise<void>
}

export const DealerSettingsForm = ({
  dealer,
  values,
  errors,
  saving,
  uploadingLogo,
  uploadingBanner,
  onChange,
  onSave,
  onUploadLogo,
  onUploadBanner
}: DealerSettingsFormProps) => {
  const logoUrl = dealerSettingsService.resolveLogoUrl(dealer.logoPath)
  const bannerUrl = dealerSettingsService.resolveBannerUrl(dealer.bannerPath)

  const setField = <K extends keyof DealerSettingsFormValues>(key: K, value: DealerSettingsFormValues[K]) => {
    onChange({ ...values, [key]: value })
  }

  return (
    <Stack spacing={3}>
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

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='Nombre del concesionario'
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='Correo electrónico'
            type='email'
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='Teléfono'
            value={values.phone}
            onChange={(event) => setField('phone', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='WhatsApp'
            value={values.whatsapp}
            onChange={(event) => setField('whatsapp', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label='Dirección'
            value={values.address}
            onChange={(event) => setField('address', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            label='Ciudad'
            value={values.city}
            onChange={(event) => setField('city', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            label='Provincia / Estado'
            value={values.state}
            onChange={(event) => setField('state', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            label='Código postal'
            value={values.zipCode}
            onChange={(event) => setField('zipCode', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='País'
            value={values.country}
            onChange={(event) => setField('country', event.target.value)}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='Sitio web'
            value={values.website}
            onChange={(event) => setField('website', event.target.value)}
            error={Boolean(errors.website)}
            helperText={errors.website ?? 'Opcional. Ejemplo: www.miconcesionario.com'}
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label='Slug'
            value={dealer.slug ?? '—'}
            fullWidth
            disabled
            helperText='Solo lectura'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 0.75 }}>
              Estado
            </Typography>
            <Chip
              label={dealer.isActive ? 'Activo' : 'Inactivo'}
              color={dealer.isActive ? 'success' : 'default'}
              size='small'
            />
            <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 0.75 }}>
              Solo lectura
            </Typography>
          </Box>
        </Grid2>
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          startIcon={saving ? undefined : <SaveIcon />}
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </Box>
    </Stack>
  )
}
