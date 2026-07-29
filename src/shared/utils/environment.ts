export const environment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  appOrigin: (import.meta.env.VITE_APP_ORIGIN ?? '').trim().replace(/\/$/, ''),
  siteURL: location.host.includes('localhost') ? 'dev' : 'prod'
}

export const isDev = environment.siteURL === 'dev'
