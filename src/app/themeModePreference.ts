const STORAGE_KEY = 'dealer-crm-theme-mode'

export type ThemeModePreference = 'light' | 'dark'

export const readThemeModePreference = (): ThemeModePreference | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    // localStorage may be unavailable
  }
  return null
}

export const writeThemeModePreference = (mode: ThemeModePreference): void => {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore persistence errors
  }
}

export const clearThemeModePreference = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore persistence errors
  }
}
