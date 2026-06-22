import { Box, Button, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { useRef, useState, type ChangeEvent } from 'react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}

export const ImageUploader = ({ images, onChange }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [urlDraft, setUrlDraft] = useState('')

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    const dataUrls = await Promise.all(files.map(readFileAsDataUrl))
    onChange([...images, ...dataUrls])
    if (inputRef.current) inputRef.current.value = ''
  }

  const addUrl = () => {
    const trimmed = urlDraft.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setUrlDraft('')
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <Typography variant='subtitle2' sx={{ mb: 1 }}>
        Imágenes del vehículo
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <Button
          variant='outlined'
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          onClick={() => inputRef.current?.click()}
        >
          Subir desde dispositivo
        </Button>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <TextField
            placeholder='Pegar URL de imagen'
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addUrl()
              }
            }}
          />
          <Button variant='text' onClick={addUrl} disabled={!urlDraft.trim()}>
            Añadir
          </Button>
        </Box>
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Stack>
      {images.length === 0 ? (
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Aún no has subido imágenes. Las primeras imágenes serán visibles en el listado público.
          </Typography>
        </Box>
      ) : (
        <ImageList variant='masonry' cols={3} gap={8}>
          {images.map((image, index) => (
            <ImageListItem key={`${image}-${index}`} sx={{ position: 'relative' }}>
              <Box
                component='img'
                src={image}
                alt={`Imagen ${index + 1}`}
                loading='lazy'
                sx={{ borderRadius: 1.5, width: '100%', display: 'block' }}
              />
              <IconButton
                size='small'
                onClick={() => removeImage(index)}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
                }}
                aria-label='Eliminar imagen'
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  )
}
