import { useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import {
  DEFAULT_PUBLIC_LEAD_MESSAGE,
  INITIAL_PUBLIC_LEAD_INQUIRY_FORM,
  validatePublicLeadInquiry,
  type PublicLeadInquiryFormValues
} from '../utils/publicLeadInquiryValidation'
import { usePublicLeadInquiry } from '../hooks/usePublicLeadInquiry'

interface PublicVehicleContactFormProps {
  dealerSlug: string
  vehicleId: string
}

export const PublicVehicleContactForm = ({ dealerSlug, vehicleId }: PublicVehicleContactFormProps) => {
  const inquiryMutation = usePublicLeadInquiry()
  const submittingRef = useRef(false)

  const [values, setValues] = useState<PublicLeadInquiryFormValues>(INITIAL_PUBLIC_LEAD_INQUIRY_FORM)
  const [errors, setErrors] = useState<ReturnType<typeof validatePublicLeadInquiry>>({})
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const isSubmitting = inquiryMutation.isPending

  const handleChange = <K extends keyof PublicLeadInquiryFormValues>(
    field: K,
    value: PublicLeadInquiryFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (isSubmitting || submittingRef.current) return

    const validationErrors = validatePublicLeadInquiry(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    submittingRef.current = true
    setSubmitError(false)

    try {
      await inquiryMutation.mutateAsync({
        dealerSlug,
        vehicleId,
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        message: values.message.trim() || DEFAULT_PUBLIC_LEAD_MESSAGE
      })

      setSuccess(true)
      setValues(INITIAL_PUBLIC_LEAD_INQUIRY_FORM)
      setErrors({})
    } catch {
      setSubmitError(true)
    } finally {
      submittingRef.current = false
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent>
          <Alert severity='success' sx={{ alignItems: 'flex-start' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 0.5 }}>
              Gracias.
            </Typography>
            <Typography variant='body2'>
              Hemos enviado tu consulta al concesionario. Te contactarán lo antes posible.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5} component='form' onSubmit={handleSubmit} noValidate>
          <Box>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              ¿Te interesa este vehículo?
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Completa el formulario y el concesionario se comunicará contigo.
            </Typography>
          </Box>

          {submitError ? (
            <Alert severity='error'>
              No fue posible enviar tu consulta. Intenta nuevamente.
            </Alert>
          ) : null}

          <TextField
            label='Nombre'
            value={values.name}
            onChange={(event) => handleChange('name', event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
            fullWidth
            autoComplete='name'
          />

          <TextField
            label='Teléfono'
            value={values.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            required
            fullWidth
            autoComplete='tel'
          />

          <TextField
            label='Correo electrónico'
            type='email'
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
            fullWidth
            autoComplete='email'
          />

          <TextField
            label='Mensaje'
            value={values.message}
            onChange={(event) => handleChange('message', event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={values.acceptedContact}
                onChange={(event) => handleChange('acceptedContact', event.target.checked)}
              />
            }
            label='Acepto ser contactado por este concesionario.'
          />
          {errors.acceptedContact ? (
            <Typography variant='caption' color='error'>
              {errors.acceptedContact}
            </Typography>
          ) : null}

          <Button
            type='submit'
            variant='contained'
            size='large'
            fullWidth
            startIcon={<SendOutlinedIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando…' : 'Enviar consulta'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
