import type { ReactNode } from 'react'
import { DealerThemeProvider } from '@/app/DealerThemeProvider'
import type { PublicDealerProfile } from '../types'

interface PublicDealerThemeShellProps {
  profile: PublicDealerProfile
  children: ReactNode
}

export const PublicDealerThemeShell = ({ profile, children }: PublicDealerThemeShellProps) => (
  <DealerThemeProvider
    withBaseline={false}
    branding={{
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
      accentColor: profile.accentColor,
      theme: profile.theme
    }}
  >
    {children}
  </DealerThemeProvider>
)
