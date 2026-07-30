import { normalizeHexColor } from './dealerThemeUtils'

export interface HslColor {
  h: number
  s: number
  l: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const hueToRgb = (p: number, q: number, t: number): number => {
  let value = t
  if (value < 0) value += 1
  if (value > 1) value -= 1
  if (value < 1 / 6) return p + (q - p) * 6 * value
  if (value < 1 / 2) return q
  if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6
  return p
}

export const hslToHex = ({ h, s, l }: HslColor): string => {
  const hue = ((h % 360) + 360) % 360
  const saturation = clamp(s, 0, 100) / 100
  const lightness = clamp(l, 0, 100) / 100

  if (saturation === 0) {
    const channel = Math.round(lightness * 255)
    return `#${channel.toString(16).padStart(2, '0').repeat(3)}`
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q
  const hk = hue / 360

  const r = Math.round(hueToRgb(p, q, hk + 1 / 3) * 255)
  const g = Math.round(hueToRgb(p, q, hk) * 255)
  const b = Math.round(hueToRgb(p, q, hk - 1 / 3) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export const hexToHsl = (hex: string): HslColor => {
  const normalized = normalizeHexColor(hex) ?? '#808080'
  const raw = normalized.slice(1)
  const r = parseInt(raw.slice(0, 2), 16) / 255
  const g = parseInt(raw.slice(2, 4), 16) / 255
  const b = parseInt(raw.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness * 100 }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  switch (max) {
    case r:
      hue = ((g - b) / delta) % 6
      break
    case g:
      hue = (b - r) / delta + 2
      break
    default:
      hue = (r - g) / delta + 4
      break
  }

  hue *= 60
  if (hue < 0) hue += 360

  return {
    h: hue,
    s: saturation * 100,
    l: lightness * 100
  }
}

export const PRESET_BRAND_COLORS = [
  '#1976d2',
  '#2563eb',
  '#0ea5e9',
  '#0891b2',
  '#059669',
  '#16a34a',
  '#65a30d',
  '#ca8a04',
  '#ea580c',
  '#dc2626',
  '#db2777',
  '#9333ea',
  '#7c3aed',
  '#475569',
  '#0f172a',
  '#1e293b'
] as const
