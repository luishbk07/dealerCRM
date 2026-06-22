const STORAGE_PREFIX = 'dealer_crm_v1'

const buildKey = (key: string): string => `${STORAGE_PREFIX}:${key}`

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(buildKey(key))
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(buildKey(key), JSON.stringify(value))
    } catch {
      // Storage may be unavailable (private mode); fail silently to avoid breaking the UI flow.
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(buildKey(key))
    } catch {
      // Same rationale as `set`: never let a storage failure crash the app.
    }
  }
}
