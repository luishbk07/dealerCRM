import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  PRESET_BRAND_COLORS,
  hexToHsl,
  hslToHex,
  type HslColor
} from '@/shared/utils/colorPickerUtils'
import {
  getContrastText,
  getContrastWarning,
  isValidHexColor,
  normalizeHexColor
} from '@/shared/utils/dealerThemeUtils'

interface DealerColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  previewBackground?: string
}

const SL_WIDTH = 220
const SL_HEIGHT = 140
const HUE_HEIGHT = 14

const pickColorFromPanel = (
  event: ReactPointerEvent<HTMLElement>,
  element: HTMLElement,
  hue: number
): HslColor => {
  const rect = element.getBoundingClientRect()
  const x = clampCoord(event.clientX - rect.left, 0, rect.width)
  const y = clampCoord(event.clientY - rect.top, 0, rect.height)
  return {
    h: hue,
    s: (x / rect.width) * 100,
    l: 100 - (y / rect.height) * 100
  }
}

const pickHueFromSlider = (event: ReactPointerEvent<HTMLElement>, element: HTMLElement): number => {
  const rect = element.getBoundingClientRect()
  const x = clampCoord(event.clientX - rect.left, 0, rect.width)
  return (x / rect.width) * 360
}

const clampCoord = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const DealerColorField = ({
  label,
  value,
  onChange,
  error,
  previewBackground = '#ffffff'
}: DealerColorFieldProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [hsl, setHsl] = useState<HslColor>(() => hexToHsl(value))
  const slPanelRef = useRef<HTMLDivElement | null>(null)
  const hueSliderRef = useRef<HTMLDivElement | null>(null)

  const normalizedColor = useMemo(() => normalizeHexColor(value) ?? '#cccccc', [value])
  const contrastText = useMemo(() => getContrastText(normalizedColor), [normalizedColor])
  const contrastWarning = useMemo(() => {
    if (!isValidHexColor(value)) return null
    return getContrastWarning(value, previewBackground)
  }, [value, previewBackground])

  useEffect(() => {
    if (isValidHexColor(value)) {
      setHsl(hexToHsl(value))
    }
  }, [value])

  const applyHsl = useCallback((next: HslColor) => {
    setHsl(next)
    onChange(hslToHex(next))
  }, [onChange])

  const handleOpen = (target: HTMLElement) => {
    setAnchorEl(target)
    if (isValidHexColor(value)) {
      setHsl(hexToHsl(value))
    }
  }

  const handleClose = () => setAnchorEl(null)

  const handleSlPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const panel = slPanelRef.current
    if (!panel) return
    event.currentTarget.setPointerCapture(event.pointerId)
    applyHsl(pickColorFromPanel(event, panel, hsl.h))
  }

  const handleSlMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const panel = slPanelRef.current
    if (!panel) return
    applyHsl(pickColorFromPanel(event, panel, hsl.h))
  }

  const handleHuePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const slider = hueSliderRef.current
    if (!slider) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const nextHue = pickHueFromSlider(event, slider)
    applyHsl({ ...hsl, h: nextHue })
  }

  const handleHueMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const slider = hueSliderRef.current
    if (!slider) return
    const nextHue = pickHueFromSlider(event, slider)
    applyHsl({ ...hsl, h: nextHue })
  }

  const hueHex = hslToHex({ h: hsl.h, s: 100, l: 50 })
  const markerLeft = `${hsl.s}%`
  const markerTop = `${100 - hsl.l}%`
  const hueMarkerLeft = `${(hsl.h / 360) * 100}%`

  return (
    <Stack spacing={1}>
      <Typography variant='subtitle2'>{label}</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Box
          role='button'
          tabIndex={0}
          aria-label={`Abrir selector de ${label}`}
          onClick={(event) => handleOpen(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleOpen(event.currentTarget)
            }
          }}
          sx={{
            width: 56,
            height: 56,
            borderRadius: 1.5,
            backgroundColor: normalizedColor,
            color: contrastText,
            border: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: 2
            }
          }}
        >
          <PaletteOutlinedIcon fontSize='small' />
        </Box>

        <TextField
          label='Valor HEX'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          placeholder='#000000'
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  aria-label={`Abrir selector de ${label}`}
                  onClick={(event) => handleOpen(event.currentTarget)}
                >
                  <PaletteOutlinedIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>

      {contrastWarning ? (
        <FormHelperText sx={{ m: 0, color: 'warning.main' }}>{contrastWarning}</FormHelperText>
      ) : null}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { p: 2, width: { xs: 'min(92vw, 280px)', sm: 280 } }
          }
        }}
      >
        <Stack spacing={1.75}>
          <Typography variant='subtitle2'>{label}</Typography>

          <Box
            ref={slPanelRef}
            onPointerDown={handleSlPointer}
            onPointerMove={handleSlMove}
            sx={{
              position: 'relative',
              width: SL_WIDTH,
              maxWidth: '100%',
              height: SL_HEIGHT,
              borderRadius: 1.5,
              overflow: 'hidden',
              cursor: 'crosshair',
              touchAction: 'none',
              backgroundColor: hueHex,
              backgroundImage: `
                linear-gradient(to top, #000, transparent),
                linear-gradient(to right, #fff, transparent)
              `
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: markerLeft,
                top: markerTop,
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            />
          </Box>

          <Box
            ref={hueSliderRef}
            onPointerDown={handleHuePointer}
            onPointerMove={handleHueMove}
            sx={{
              position: 'relative',
              width: SL_WIDTH,
              maxWidth: '100%',
              height: HUE_HEIGHT,
              borderRadius: 999,
              cursor: 'pointer',
              touchAction: 'none',
              backgroundImage:
                'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: hueMarkerLeft,
                top: '50%',
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                backgroundColor: hslToHex({ h: hsl.h, s: 100, l: 50 })
              }}
            />
          </Box>

          <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
            {PRESET_BRAND_COLORS.map((preset) => (
              <Box
                key={preset}
                role='button'
                tabIndex={0}
                aria-label={`Usar color ${preset}`}
                onClick={() => onChange(preset)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onChange(preset)
                  }
                }}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  backgroundColor: preset,
                  border: preset === normalizedColor ? '2px solid' : '1px solid',
                  borderColor: preset === normalizedColor ? 'text.primary' : 'divider',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Stack>

          <Stack direction='row' spacing={1} alignItems='center'>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                backgroundColor: normalizedColor,
                border: '1px solid',
                borderColor: 'divider',
                flexShrink: 0
              }}
            />
            <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
              {isValidHexColor(value) ? normalizedColor.toUpperCase() : 'HEX inválido'}
            </Typography>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  )
}
