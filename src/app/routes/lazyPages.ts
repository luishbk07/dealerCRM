import { lazy } from 'react'

export const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage }))
)

export const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((module) => ({ default: module.RegisterPage }))
)

export const DealerOnboardingPage = lazy(() =>
  import('@/features/onboarding/pages/DealerOnboardingPage').then((module) => ({ default: module.DealerOnboardingPage }))
)

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage }))
)

export const VehiclesListPage = lazy(() =>
  import('@/features/vehicles/pages/VehiclesListPage').then((module) => ({ default: module.VehiclesListPage }))
)

export const VehicleCreatePage = lazy(() =>
  import('@/features/vehicles/pages/VehicleCreatePage').then((module) => ({ default: module.VehicleCreatePage }))
)

export const VehicleEditPage = lazy(() =>
  import('@/features/vehicles/pages/VehicleEditPage').then((module) => ({ default: module.VehicleEditPage }))
)

export const PublicVehiclePage = lazy(() =>
  import('@/features/vehicles/pages/PublicVehiclePage').then((module) => ({ default: module.PublicVehiclePage }))
)

export const LeadsListPage = lazy(() =>
  import('@/features/leads/pages/LeadsListPage').then((module) => ({ default: module.LeadsListPage }))
)

export const LeadDetailPage = lazy(() =>
  import('@/features/leads/pages/LeadDetailPage').then((module) => ({ default: module.LeadDetailPage }))
)

export const SalesListPage = lazy(() =>
  import('@/features/sales/pages/SalesListPage').then((module) => ({ default: module.SalesListPage }))
)

export const SaleDetailPage = lazy(() =>
  import('@/features/sales/pages/SaleDetailPage').then((module) => ({ default: module.SaleDetailPage }))
)

export const DealerSettingsPage = lazy(() =>
  import('@/features/settings/pages/DealerSettingsPage').then((module) => ({ default: module.DealerSettingsPage }))
)

export const PublicDealerPage = lazy(() =>
  import('@/features/public-site/pages/PublicDealerPage').then((module) => ({ default: module.PublicDealerPage }))
)

export const PublicVehicleDetailPage = lazy(() =>
  import('@/features/public-site/pages/PublicVehicleDetailPage').then((module) => ({ default: module.PublicVehicleDetailPage }))
)

export const NotFoundPage = lazy(() =>
  import('@/app/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
)
