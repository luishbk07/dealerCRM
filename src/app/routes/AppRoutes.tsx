import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { LoadingState } from '@/shared/components'
import { AuthGuard } from './AuthGuard'
import { DealerGuard } from '@/shared/guards'
import { paths } from './paths'
import {
  DashboardPage,
  DealerOnboardingPage,
  DealerSettingsPage,
  LeadDetailPage,
  LeadsListPage,
  LoginPage,
  NotFoundPage,
  PublicDealerPage,
  PublicVehicleDetailPage,
  PublicVehiclePage,
  RegisterPage,
  SaleDetailPage,
  SalesListPage,
  VehicleCreatePage,
  VehicleEditPage,
  VehiclesListPage
} from './lazyPages'

const RouteFallback = () => <LoadingState message='Cargando…' />

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<RegisterPage />} />
        <Route path={paths.vehiclePublic()} element={<PublicVehiclePage />} />
        <Route path={paths.dealerPublic()} element={<PublicDealerPage />} />
        <Route path={paths.dealerPublicVehicle()} element={<PublicVehicleDetailPage />} />

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

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
