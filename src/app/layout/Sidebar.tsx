import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, Divider } from '@mui/material'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'

const DRAWER_WIDTH = 256

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
  dealershipName: string
  logoUrl?: string | null
}

const SidebarContent = ({
  dealershipName,
  logoUrl,
  onItemClick
}: {
  dealershipName: string
  logoUrl?: string | null
  onItemClick?: () => void
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            backgroundColor: logoUrl ? 'background.paper' : 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: logoUrl ? '1px solid' : 'none',
            borderColor: 'divider',
            flexShrink: 0
          }}
        >
          {logoUrl ? (
            <Box
              component='img'
              src={logoUrl}
              alt={`Logo de ${dealershipName}`}
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <DirectionsCarFilledIcon fontSize='small' />
          )}
        </Box>
        <Box>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Dealer CRM
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {dealershipName}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              onClick={onItemClick}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'text.secondary',
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' }
                },
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant='caption' color='text.secondary'>
          v0.1.0 · MVP
        </Typography>
      </Box>
    </Box>
  )
}

export const Sidebar = ({ mobileOpen, onClose, dealershipName, logoUrl }: SidebarProps) => {
  return (
    <Box
      component='nav'
      aria-label='Navegación principal'
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 }
      }}
    >
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' }
        }}
      >
        <SidebarContent dealershipName={dealershipName} logoUrl={logoUrl} onItemClick={onClose} />
      </Drawer>
      <Drawer
        variant='permanent'
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <SidebarContent dealershipName={dealershipName} logoUrl={logoUrl} />
      </Drawer>
    </Box>
  )
}

export const SIDEBAR_WIDTH = DRAWER_WIDTH
