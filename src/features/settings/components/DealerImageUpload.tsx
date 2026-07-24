  import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
  import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
  import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
  import { useRef, type ChangeEvent } from 'react'

  interface DealerImageUploadProps {
    label: string
    helperText: string
    imageUrl: string | null
    uploading?: boolean
    aspectRatio?: string
    onUpload: (file: File) => Promise<void>
  }

  export const DealerImageUpload = ({
    label,
    helperText,
    imageUrl,
    uploading,
    aspectRatio = '1 / 1',
    onUpload
  }: DealerImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await onUpload(file)
      if (inputRef.current) inputRef.current.value = ''
    }

    return (
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Stack spacing={1.5}>
          <Box
            sx={{
              width: '100%',
              maxWidth: label === 'Banner' ? '100%' : 160,
              aspectRatio,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              position: 'relative'
            }}
          >
            {imageUrl ? (
              <Box
                component='img'
                src={imageUrl}
                alt={label}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <StorefrontOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            )}
            {uploading ? (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.72)'
                }}
              >
                <CircularProgress size={28} />
              </Box>
            ) : null}
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
            <Button
              variant='outlined'
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {imageUrl ? 'Reemplazar imagen' : 'Subir imagen'}
            </Button>
            <Typography variant='caption' color='text.secondary'>
              {helperText}
            </Typography>
          </Stack>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            hidden
            aria-label={`Subir ${label.toLowerCase()}`}
            onChange={(event) => void handleSelect(event)}
          />
        </Stack>
      </Box>
    )
  }
