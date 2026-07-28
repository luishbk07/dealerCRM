import { Box, IconButton, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x720/E2E8F0/64748B?text=Sin+imagen'

interface PublicVehicleGalleryProps {
  imageUrls: string[]
  alt: string
}

export const PublicVehicleGallery = memo(({ imageUrls, alt }: PublicVehicleGalleryProps) => {
  const urls = useMemo(
    () => (imageUrls.length > 0 ? imageUrls : [PLACEHOLDER_IMAGE]),
    [imageUrls]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const currentUrl = urls[activeIndex] ?? urls[0]

  const goToPrevious = useCallback(() => {
    setActiveIndex((index) => (index === 0 ? urls.length - 1 : index - 1))
  }, [urls.length])

  const goToNext = useCallback(() => {
    setActiveIndex((index) => (index === urls.length - 1 ? 0 : index + 1))
  }, [urls.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (urls.length <= 1) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious, urls.length])

  useEffect(() => {
    if (activeIndex >= urls.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, urls.length])

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
          aspectRatio: '16 / 10'
        }}
      >
        <Box
          component='img'
          src={currentUrl}
          alt={alt}
          loading='lazy'
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {urls.length > 1 ? (
          <>
            <IconButton
              aria-label='Imagen anterior'
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 12,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                color: 'common.white',
                '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.75)' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label='Imagen siguiente'
              onClick={goToNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 12,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                color: 'common.white',
                '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.75)' }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        ) : null}
      </Box>

      {urls.length > 1 ? (
        <Stack direction='row' spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {urls.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              component='button'
              type='button'
              onClick={() => setActiveIndex(index)}
              sx={{
                border: index === activeIndex ? '2px solid' : '1px solid',
                borderColor: index === activeIndex ? 'primary.main' : 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                p: 0,
                cursor: 'pointer',
                flex: '0 0 96px',
                aspectRatio: '4 / 3',
                background: 'none'
              }}
              aria-label={`Imagen ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <Box
                component='img'
                src={url}
                alt={`${alt} ${index + 1}`}
                loading='lazy'
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
})

PublicVehicleGallery.displayName = 'PublicVehicleGallery'
