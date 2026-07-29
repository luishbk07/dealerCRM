import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { useState, type MouseEvent } from 'react'
import type { VehicleWithImages } from '@/shared/types'

interface VehicleActionsMenuProps {
  vehicle: VehicleWithImages
  onShare: (vehicle: VehicleWithImages) => void
}

export const VehicleActionsMenu = ({ vehicle, onShare }: VehicleActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleShare = () => {
    handleClose()
    onShare(vehicle)
  }

  return (
    <>
      <IconButton
        size='small'
        aria-label='Acciones del vehículo'
        onClick={handleOpen}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          boxShadow: 1,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
        }}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={(event) => event.stopPropagation()}>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareOutlinedIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Compartir</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
