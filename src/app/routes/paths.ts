export const paths = {
  login: '/login',
  dashboard: '/',
  vehicles: '/vehicles',
  vehicleNew: '/vehicles/new',
  vehicleEdit: (id: string = ':id') => `/vehicles/${id}/edit`,
  vehiclePublic: (id: string = ':id') => `/vehicles/${id}/public`,
  leads: '/leads',
  leadDetail: (id: string = ':id') => `/leads/${id}`,
  sales: '/sales'
} as const
