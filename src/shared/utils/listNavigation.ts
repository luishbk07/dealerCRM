export interface ListReturnState {
  returnTo?: string
}

export const withListReturn = (returnTo: string): { state: ListReturnState } => ({
  state: { returnTo }
})

export const getReturnPath = (
  state: unknown,
  fallback: string
): string => {
  if (state && typeof state === 'object' && 'returnTo' in state) {
    const returnTo = (state as ListReturnState).returnTo
    if (typeof returnTo === 'string' && returnTo.trim()) return returnTo
  }
  return fallback
}
