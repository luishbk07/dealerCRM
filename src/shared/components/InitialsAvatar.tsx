import { Avatar, type AvatarProps } from '@mui/material'
import { buildInitials } from '@/shared/utils/initials'

interface InitialsAvatarProps extends Omit<AvatarProps, 'children'> {
  name: string | null | undefined
}

export const InitialsAvatar = ({ name, sx, ...rest }: InitialsAvatarProps) => (
  <Avatar
    {...rest}
    sx={{
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      fontWeight: 600,
      ...sx
    }}
  >
    {buildInitials(name)}
  </Avatar>
)
