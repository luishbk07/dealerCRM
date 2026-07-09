export const environment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  siteURL: location.host.includes('localhost') ? 'dev' : 'prod'
}

export const isDev = environment.siteURL === 'dev'
