export const USER_MESSAGES = {
  loadFailed: 'No se pudo cargar la información.',
  saveFailed: 'No se pudo guardar.',
  deleteFailed: 'No se pudo eliminar.',
  tryAgain: 'Intenta nuevamente.',
  notFound: 'No encontramos lo que buscas.',
  vehicleCreated: 'Vehículo publicado correctamente.',
  vehicleUpdated: 'Vehículo actualizado correctamente.',
  vehicleDeleted: 'Vehículo eliminado correctamente.',
  leadCreated: 'Lead creado correctamente.',
  leadUpdated: 'Lead actualizado correctamente.',
  leadDeleted: 'Lead eliminado correctamente.',
  saleRegistered: 'Venta registrada correctamente.',
  taskCreated: 'Seguimiento creado.',
  taskCompleted: 'Seguimiento completado.',
  taskDeleted: 'Seguimiento eliminado.',
  settingsUpdated: 'Configuración actualizada correctamente.',
  imageUploaded: 'Imagen subida correctamente.',
  logoUploaded: 'Logo actualizado correctamente.',
  bannerUploaded: 'Banner actualizado correctamente.'
} as const

const isTechnicalMessage = (message: string): boolean =>
  /PGRST|JWT|permission denied|RLS|schema cache|Failed to /i.test(message)

export const getUserFriendlyError = (
  error: unknown,
  fallback: string = USER_MESSAGES.loadFailed
): string => {
  if (!error) return fallback
  if (typeof error === 'string') {
    const trimmed = error.trim()
    if (!trimmed) return fallback
    return isTechnicalMessage(trimmed) ? fallback : trimmed
  }
  if (error instanceof Error) {
    const message = error.message.trim()
    if (!message) return fallback
    if (/failed to fetch|network|timeout/i.test(message)) {
      return `${fallback} ${USER_MESSAGES.tryAgain}`
    }
    if (isTechnicalMessage(message)) {
      return fallback
    }
    return message
  }
  return fallback
}
