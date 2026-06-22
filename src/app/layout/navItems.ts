import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { paths } from '@/app/routes/paths'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<SvgIconProps>
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: paths.dashboard, icon: DashboardOutlinedIcon },
  { label: 'Vehículos', to: paths.vehicles, icon: DirectionsCarFilledOutlinedIcon },
  { label: 'Leads', to: paths.leads, icon: ChatBubbleOutlineOutlinedIcon },
  { label: 'Ventas', to: paths.sales, icon: TrendingUpOutlinedIcon }
]
