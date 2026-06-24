# Dealer CRM

CRM SaaS para concesionarios de vehículos en República Dominicana. MVP en React + Vite + TypeScript + Material UI.

Construido para que un concesionario pueda:

- Publicar y administrar su inventario de vehículos
- Captar leads desde su página pública y centralizarlos en una bandeja tipo inbox
- Hacer seguimiento del pipeline (nuevo → contactado → negociando → vendido / perdido)
- Generar copias optimizadas para Facebook, Instagram y Marketplace con un clic
- Visualizar ventas y métricas mensuales del negocio

## Stack

- React 18 + Vite + TypeScript
- Material UI v6 (incluyendo `Grid2`)
- React Router v6
- Context API para autenticación y notificaciones
- **Supabase** (Auth + Postgres) para registro, sesión, perfiles y concesionarios
- Capa de servicios con interfaces TS lista para sustituirse por una API real (vehículos, leads y ventas siguen siendo mock + LocalStorage para esta fase del MVP)

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Project Settings → API**, copia `Project URL` y `anon public key`.
3. Copia `.env.example` a `.env` y rellena los valores:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Ejecuta el siguiente SQL en el editor SQL de Supabase para crear las tablas y políticas:

```sql
-- profiles: una fila por usuario autenticado
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'dealer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- dealers: cada usuario tiene como máximo un concesionario
create table public.dealers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  address text,
  city text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.dealers enable row level security;

create policy "Profiles are visible to the owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles can be inserted by the owner" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Profiles can be updated by the owner" on public.profiles
  for update using (auth.uid() = id);

create policy "Dealers are accessible to the owner" on public.dealers
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```

5. (Opcional, recomendado para desarrollo) En **Auth → Providers → Email**, desactiva *Confirm email* para que el flujo de registro entre directo a onboarding sin verificación de correo.

## Scripts

```bash
npm install
npm run dev        # arranca el servidor en http://localhost:5173
npm run build      # build de producción
npm run typecheck  # solo type-check
npm run lint       # ESLint
npm run preview    # previsualiza el build de producción
```

## Flujo de la aplicación

1. El usuario abre la app y puede iniciar sesión o registrarse.
2. **Registro** (`/register`) → Supabase Auth crea el usuario → se crea su `profile` con rol `dealer`.
3. Si el usuario aún no tiene un `dealer`, se le redirige a **Onboarding** (`/onboarding`) para crear su concesionario.
4. Con el dealer creado, accede al **Dashboard** (`/`) y al resto de la app.
5. Si un usuario sin sesión intenta entrar a una ruta protegida, se redirige a `/login`.
6. Si un usuario autenticado sin dealer accede a rutas internas, se redirige a `/onboarding`.

Estas reglas las implementan `AuthGuard` y `DealerGuard` en `src/app/routes/`.

## Estructura del proyecto

```
src/
  app/                  # composición de la aplicación
    layout/             # AppLayout, Sidebar, Topbar
    routes/             # AppRoutes, AuthGuard, DealerGuard, paths
    theme.ts            # tema MUI (Inter, paleta SaaS limpia)
    App.tsx             # punto de entrada de la app
  features/             # cada feature es autocontenida
    auth/
      components/       # AuthCardShell (layout reutilizado por login/register)
      context/          # AuthProvider + useAuth (sesión, perfil, dealer)
      services/         # authService (Supabase), profileService
      utils/            # validation (email, password, registro)
      pages/            # LoginPage, RegisterPage
    dealers/
      hooks/            # useDealerForm
      services/         # dealerService (CRUD vía Supabase)
      pages/            # OnboardingPage
    dashboard/
      hooks/            # useDashboardData
      components/       # RecentLeadsList, PipelineSnapshot
      pages/            # DashboardPage
    vehicles/
      hooks/            # useVehicles, useVehicleForm
      components/       # VehicleCard, VehicleForm, ImageUploader, AdGeneratorDialog
      pages/            # VehiclesListPage, VehicleCreatePage, VehicleEditPage, PublicVehiclePage
    leads/
      hooks/            # useLeads
      components/       # LeadInbox, LeadConversation, LeadSidePanel
      pages/            # LeadsInboxPage
    sales/
      hooks/            # useSalesData
      components/       # MonthlyChart
      pages/            # SalesPage
  shared/
    components/         # PageHeader, StatusChip, KpiCard, EmptyState, LoadingState, ConfirmDialog
    hooks/              # useAsync, useToast
    services/           # vehicleService, leadService, saleService, authService, adGeneratorService, storage, seedData
    types/              # tipos de dominio: Vehicle, Lead, Sale, User
    utils/              # format, id, delay
  main.tsx              # bootstrap (ThemeProvider, AuthProvider, Router, App)
```

## Decisiones de arquitectura

- **Features autocontenidas.** Cada feature posee sus páginas, componentes y hooks. Los módulos sólo dependen de `shared/` y nunca entre sí (excepto Leads que consume el hook `useVehicles` de `vehicles/` por necesidad de catálogo: una dependencia explícita, no circular).
- **Servicios con interfaces.** `VehicleService`, `LeadService`, `SaleService`, `AuthService`, `AdGeneratorService` están tipados con interfaces. La implementación actual usa LocalStorage + mock data, pero puede sustituirse por `fetch` contra una API real sin tocar componentes.
- **Componentes "dumb" donde se puede.** La UI recibe props y dispara callbacks. La lógica vive en hooks (`useVehicles`, `useLeads`, `useDashboardData`, `useSalesData`).
- **Estado local primero.** No hay Redux. La autenticación y las notificaciones usan Context; el resto del estado vive cerca de quien lo necesita.
- **SOLID.**
  - SRP: cada hook y servicio tiene una sola responsabilidad.
  - OCP: añadir un nuevo canal de anuncios sólo requiere extender `adGeneratorService`.
  - LSP/ISP: las interfaces de servicios son mínimas, sin métodos que algunos consumidores ignoren.
  - DIP: las páginas consumen abstracciones (interfaces de servicios) en vez de implementaciones.
- **Persistencia.** Los datos se guardan en LocalStorage bajo el prefijo `dealer_crm_v1:`. Para resetear el demo basta con limpiar el storage del navegador.

## Estilo de código

- Comillas simples siempre, *template literals* para interpolación.
- Sin punto y coma al final de las sentencias.
- Funciones pequeñas y nombres explícitos.
- Comentarios sólo donde explican intención no obvia.

## Próximos pasos sugeridos

- Sustituir mocks por integración con un backend (Supabase / Node API).
- Subida real de imágenes (S3 / Cloudinary) reemplazando `ImageUploader`.
- IA real para el generador de anuncios (OpenAI / Anthropic) detrás de `adGeneratorService`.
- Notificaciones push / email cuando llega un lead.
- Roles (admin vs. ventas) y multi-usuario por concesionario.
