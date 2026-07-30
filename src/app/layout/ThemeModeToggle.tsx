import { IconButton, Tooltip } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useDealerThemeControls } from '@/app/DealerThemeProvider'

export const ThemeModeToggle = () => {
  const { paletteMode, togglePaletteMode } = useDealerThemeControls()
  const isDark = paletteMode === 'dark'

  return (
    <Tooltip title={isDark ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton
        onClick={togglePaletteMode}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        sx={{ color: 'text.secondary' }}
      >
        {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  )
}
