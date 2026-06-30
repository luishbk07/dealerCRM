import { Box, Button, IconButton, ImageList, ImageListItem, Stack, Tooltip, Typography } from '@mui/material'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useEffect, useMemo, useRef, type ChangeEvent } from 'react'
import type { VehicleImage } from '@/shared/types'
import { vehicleService } from '../services/vehicleService'

export interface PendingImage {
  id: string
  file: File
  previewUrl: string
  isPrimary: boolean
}

interface ImageUploaderProps {
  existingImages: VehicleImage[]
  pendingImages: PendingImage[]
  onAddFiles: (files: File[]) => void
  onRemovePending: (id: string) => void
  onTogglePendingPrimary: (id: string) => void
  onDeleteExisting?: (image: VehicleImage) => void
  onSetExistingPrimary?: (image: VehicleImage) => void
  uploading?: boolean
}

export const ImageUploader = ({
  existingImages,
  pendingImages,
  onAddFiles,
  onRemovePending,
  onTogglePendingPrimary,
  onDeleteExisting,
  onSetExistingPrimary,
  uploading
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) onAddFiles(files)
    if (inputRef.current) inputRef.current.value = ''
  }

  const existingThumbnails = useMemo(
    () => existingImages.map((image) => ({ image, url: vehicleService.resolveImageUrl(image) })),
    [existingImages]
  )

  useEffect(() => {
    return () => {
      pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [pendingImages])

  const hasAny = existingThumbnails.length > 0 || pendingImages.length > 0

  return (
    <Box>
      <Typography variant='subtitle2' sx={{ mb: 1 }}>
        Imágenes del vehículo
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }} alignItems={{ sm: 'center' }}>
        <Button
          variant='outlined'
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Añadir imágenes
        </Button>
        <Typography variant='caption' color='text.secondary'>
          La imagen marcada como principal aparecerá primero en el catálogo público.
        </Typography>
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Stack>

      {!hasAny ? (
        <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            Aún no has subido imágenes para este vehículo.
          </Typography>
        </Box>
      ) : (
        <ImageList variant='masonry' cols={3} gap={8}>
          {existingThumbnails.map(({ image, url }) => (
            <ImageListItem key={`existing-${image.id}`} sx={{ position: 'relative' }}>
              <Box
                component='img'
                src={url}
                alt={`Imagen ${image.id}`}
                loading='lazy'
                sx={{ borderRadius: 1.5, width: '100%', display: 'block' }}
              />
              <Stack
                direction='row'
                spacing={0.5}
                sx={{ position: 'absolute', top: 6, right: 6 }}
              >
                {onSetExistingPrimary ? (
                  <Tooltip title={image.isPrimary ? 'Imagen principal' : 'Marcar como principal'}>
                    <IconButton
                      size='small'
                      onClick={() => !image.isPrimary && onSetExistingPrimary(image)}
                      sx={{
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        color: image.isPrimary ? '#FACC15' : 'white',
                        '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
                      }}
                    >
                      {image.isPrimary ? <StarIcon fontSize='inherit' /> : <StarBorderIcon fontSize='inherit' />}
                    </IconButton>
                  </Tooltip>
                ) : null}
                {onDeleteExisting ? (
                  <Tooltip title='Eliminar imagen'>
                    <IconButton
                      size='small'
                      onClick={() => onDeleteExisting(image)}
                      sx={{
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
                      }}
                    >
                      <CloseIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Stack>
            </ImageListItem>
          ))}
          {pendingImages.map((image) => (
            <ImageListItem key={`pending-${image.id}`} sx={{ position: 'relative' }}>
              <Box
                component='img'
                src={image.previewUrl}
                alt={image.file.name}
                loading='lazy'
                sx={{ borderRadius: 1.5, width: '100%', display: 'block', opacity: 0.95 }}
              />
              <Stack direction='row' spacing={0.5} sx={{ position: 'absolute', top: 6, right: 6 }}>
                <Tooltip title={image.isPrimary ? 'Pendiente: principal' : 'Marcar como principal'}>
                  <IconButton
                    size='small'
                    onClick={() => onTogglePendingPrimary(image.id)}
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      color: image.isPrimary ? '#FACC15' : 'white',
                      '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
                    }}
                  >
                    {image.isPrimary ? <StarIcon fontSize='inherit' /> : <StarBorderIcon fontSize='inherit' />}
                  </IconButton>
                </Tooltip>
                <Tooltip title='Quitar de la subida'>
                  <IconButton
                    size='small'
                    onClick={() => onRemovePending(image.id)}
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
                    }}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 6,
                  left: 6,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  color: 'white'
                }}
              >
                <Typography variant='caption'>Pendiente</Typography>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  )
}
