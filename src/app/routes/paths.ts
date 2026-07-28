export const paths = {
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  dashboard: '/',
  vehicles: '/vehicles',
  vehicleNew: '/vehicles/new',
  vehicleEdit: (id: string = ':id') => `/vehicles/${id}/edit`,
  vehiclePublic: (id: string = ':id') => `/vehicles/${id}/public`,
  dealerPublic: (slug: string = ':dealerSlug') => `/d/${slug}`,
  dealerPublicVehicle: (slug: string = ':dealerSlug', vehicleId: string = ':vehicleId') =>
    `/d/${slug}/vehiculo/${vehicleId}`,
  leads: '/leads',
  leadDetail: (id: string = ':id') => `/leads/${id}`,
  sales: '/sales',
  saleDetail: (id: string = ':id') => `/sales/${id}`,
  settings: '/settings'
} as const
