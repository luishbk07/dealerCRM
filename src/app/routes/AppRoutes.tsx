import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { AuthGuard } from './AuthGuard'
import { DealerGuard } from '@/shared/guards'
import { paths } from './paths'
import { LoginPage, RegisterPage } from '@/features/auth'
import { DealerOnboardingPage } from '@/features/onboarding'
import { DashboardPage } from '@/features/dashboard'
import { VehiclesListPage, VehicleCreatePage, VehicleEditPage, PublicVehiclePage } from '@/features/vehicles'
import { LeadsListPage, LeadDetailPage } from '@/features/leads'
import { SalesListPage, SaleDetailPage } from '@/features/sales'
import { DealerSettingsPage } from '@/features/settings'
import { PublicDealerPage } from '@/features/public-site'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.register} element={<RegisterPage />} />
      <Route path={paths.vehiclePublic()} element={<PublicVehiclePage />} />
      <Route path={paths.dealerPublic()} element={<PublicDealerPage />} />

      <Route element={<AuthGuard />}>
        <Route path={paths.onboarding} element={<DealerOnboardingPage />} />

        <Route
          element={
            <DealerGuard>
              <AppLayout />
            </DealerGuard>
          }
        >
          <Route path={paths.dashboard} element={<DashboardPage />} />
          <Route path={paths.vehicles} element={<VehiclesListPage />} />
          <Route path={paths.vehicleNew} element={<VehicleCreatePage />} />
          <Route path={paths.vehicleEdit()} element={<VehicleEditPage />} />
          <Route path={paths.leads} element={<LeadsListPage />} />
          <Route path={paths.leadDetail()} element={<LeadDetailPage />} />
          <Route path={paths.sales} element={<SalesListPage />} />
          <Route path={paths.saleDetail()} element={<SaleDetailPage />} />
          <Route path={paths.settings} element={<DealerSettingsPage />} />
        </Route>
      </Route>

      <Route path='*' element={<Navigate to={paths.dashboard} replace />} />
    </Routes>
  )
}
