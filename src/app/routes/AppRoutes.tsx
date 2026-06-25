import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { AuthGuard } from './AuthGuard'
import { DealerGuard } from '@/shared/guards'
import { paths } from './paths'
import { LoginPage, RegisterPage } from '@/features/auth'
import { DealerOnboardingPage } from '@/features/onboarding'
import { DashboardPage } from '@/features/dashboard'
import { VehiclesListPage, VehicleCreatePage, VehicleEditPage, PublicVehiclePage } from '@/features/vehicles'
import { LeadsInboxPage } from '@/features/leads'
import { SalesPage } from '@/features/sales'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.register} element={<RegisterPage />} />
      <Route path={paths.vehiclePublic()} element={<PublicVehiclePage />} />

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
          <Route path={paths.leads} element={<LeadsInboxPage />} />
          <Route path={paths.leadDetail()} element={<LeadsInboxPage />} />
          <Route path={paths.sales} element={<SalesPage />} />
        </Route>
      </Route>

      <Route path='*' element={<Navigate to={paths.dashboard} replace />} />
    </Routes>
  )
}
