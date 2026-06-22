import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { paths } from './paths'
import { LoginPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { VehiclesListPage, VehicleCreatePage, VehicleEditPage, PublicVehiclePage } from '@/features/vehicles'
import { LeadsInboxPage } from '@/features/leads'
import { SalesPage } from '@/features/sales'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.vehiclePublic()} element={<PublicVehiclePage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
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

      <Route path='*' element={<Navigate to={paths.dashboard} replace />} />
    </Routes>
  )
}
