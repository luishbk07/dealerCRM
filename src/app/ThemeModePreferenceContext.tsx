import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  readThemeModePreference,
  writeThemeModePreference,
  type ThemeModePreference
} from './themeModePreference'

interface ThemeModePreferenceContextValue {
  preference: ThemeModePreference | null
  setPreference: (mode: ThemeModePreference) => void
  togglePreference: (currentMode: ThemeModePreference) => void
}

const ThemeModePreferenceContext = createContext<ThemeModePreferenceContextValue | null>(null)

export const ThemeModePreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemeModePreference | null>(() => readThemeModePreference())

  const setPreference = useCallback((mode: ThemeModePreference) => {
    setPreferenceState(mode)
    writeThemeModePreference(mode)
  }, [])

  const togglePreference = useCallback((currentMode: ThemeModePreference) => {
    setPreference(currentMode === 'dark' ? 'light' : 'dark')
  }, [setPreference])

  const value = useMemo(
    () => ({ preference, setPreference, togglePreference }),
    [preference, setPreference, togglePreference]
  )

  return (
    <ThemeModePreferenceContext.Provider value={value}>
      {children}
    </ThemeModePreferenceContext.Provider>
  )
}

export const useThemeModePreference = (): ThemeModePreferenceContextValue => {
  const context = useContext(ThemeModePreferenceContext)
  if (!context) {
    throw new Error('useThemeModePreference debe usarse dentro de ThemeModePreferenceProvider')
  }
  return context
}
