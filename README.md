# Dealer CRM

CRM SaaS multi-tenant para concesionarios de vehículos en República Dominicana. Frontend en React + Vite + TypeScript + Material UI, backend en Supabase (Auth + Postgres + Storage) con Row Level Security.

## Stack

- React 18 + Vite + TypeScript
- Material UI v6 (incluyendo `Grid2`)
- React Router v6
- **@tanstack/react-query** (cache + estado servidor)
- **Supabase** Auth + Postgres + Storage (única fuente de datos)

## Arquitectura

```
UI components → Hooks (React Query) → Services → Repositories → Supabase
```

- **Components**: presentación, sin lógica de datos ni llamadas a Supabase.
- **Hooks**: `useQuery` / `useMutation`. Solo orquestan, nunca acceden a `supabase` directamente.
- **Services** (`src/features/<feature>/services/`): lógica de negocio (combinar repositorios, validar, mapear DTO → repo input).
- **Repositories** (`src/shared/repositories/`): única capa que habla con Supabase.
- **RLS** controla todo el acceso: el frontend nunca filtra por `dealer_id` en `SELECT`. En `INSERT` se envía `dealer_id` para cumplir `WITH CHECK`.

> Toda nueva propiedad, columna, DTO o consulta debe basarse en el esquema actual. **Nunca inventamos columnas.** Ver `ARCHITECTURE.md`.

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Project Settings → API**, copia `Project URL` y `anon public key`.
3. Copia `.env.example` a `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Asegúrate de tener estas tablas (resumen del esquema actual; la app no usa más columnas que estas):

| Tabla | Columnas |
| --- | --- |
| `profiles` | `id`, `full_name`, `role`, `dealer_id`, `created_at` |
| `dealers` | `id`, `owner_id`, `name`, `phone`, `whatsapp`, `address`, `logo_url`, `created_at` |
| `vehicles` | `id`, `dealer_id`, `brand`, `model`, `year`, `price`, `mileage`, `transmission`, `fuel_type`, `description`, `status`, `vin`, `stock_number`, `trim`, `body_style`, `exterior_color`, `interior_color`, `drivetrain`, `engine`, `sale_price`, `featured`, `created_at`, `updated_at` |
| `vehicle_images` | `id`, `vehicle_id`, `url`, `storage_path`, `position`, `display_order`, `is_primary`, `created_at` |
| `leads` | `id`, `dealer_id`, `vehicle_id`, `name`, `phone`, `message`, `source`, `status`, `created_at`, `last_contact_at` |
| `lead_notes` | `id`, `lead_id`, `note`, `created_at` |
| `lead_messages` | `id`, `lead_id`, `sender`, `message`, `created_at` |
| `sales` | `id`, `dealer_id`, `vehicle_id`, `lead_id`, `price`, `sold_at` |

5. **Storage**: crea un bucket público llamado `vehicle-images`. El frontend sube bajo `dealers/<dealerId>/vehicles/<vehicleId>/...` y resuelve URLs con `getPublicUrl(storage_path)`.

   Si los uploads devuelven **403 Forbidden**, el cliente ya envía la petición correctamente — falta configurar políticas de Storage. Ejecuta el script completo:

   `supabase/storage-setup.sql`

   Ese script crea el bucket, una función `storage_dealer_prefix()` (`security definer`, evita que RLS en `dealers` bloquee la subconsulta de la política) y políticas de lectura/escritura/borrado.

   Verificación rápida en SQL Editor (como usuario autenticado en la app, o sustituye el UUID):

```sql
select id, owner_id from public.dealers where owner_id = auth.uid();
select public.storage_dealer_prefix();
```

   El segundo query debe devolver el mismo `id` que aparece en la ruta del upload (`dealers/e2ab.../...`). Si es `null`, completa el onboarding del dealer primero.

6. **Vistas para el dashboard**. La app lee KPIs desde 3 vistas. Si aún no existen, créalas con este SQL. Todas usan `auth.uid()` indirectamente vía `dealers.owner_id`, así que cada usuario ve solo sus métricas.

```sql
-- Estadísticas agregadas por dealer
create or replace view public.dealer_stats_view as
with current_dealer as (
  select id from public.dealers where owner_id = auth.uid()
)
select
  (select count(*) from public.vehicles v, current_dealer d where v.dealer_id = d.id) as total_vehicles,
  (select count(*) from public.vehicles v, current_dealer d where v.dealer_id = d.id and v.status = 'active') as active_vehicles,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id) as total_leads,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'new') as new_leads,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'contacted') as contacted_leads,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'qualified') as qualified_leads,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'lost') as lost_leads,
  (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'sold') as sold_leads,
  (select count(*) from public.sales s, current_dealer d
     where s.dealer_id = d.id
       and date_trunc('month', s.sold_at) = date_trunc('month', now())) as monthly_sales_count,
  (select coalesce(sum(s.price), 0) from public.sales s, current_dealer d
     where s.dealer_id = d.id
       and date_trunc('month', s.sold_at) = date_trunc('month', now())) as monthly_revenue,
  (select coalesce(sum(s.price), 0) from public.sales s, current_dealer d where s.dealer_id = d.id) as total_revenue,
  (select coalesce(avg(s.price), 0) from public.sales s, current_dealer d where s.dealer_id = d.id) as average_sale_price,
  case
    when (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id) = 0 then 0
    else (
      (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id and l.status = 'sold')::numeric
      / (select count(*) from public.leads l, current_dealer d where l.dealer_id = d.id)::numeric
    )
  end as conversion_rate;

-- Ventas mensuales (últimos 6 meses)
create or replace view public.monthly_sales_view as
select
  date_trunc('month', s.sold_at)::date as month_start,
  count(*)::int as sales_count,
  coalesce(sum(s.price), 0) as revenue
from public.sales s
where s.dealer_id in (select id from public.dealers where owner_id = auth.uid())
  and s.sold_at >= (date_trunc('month', now()) - interval '5 months')
group by 1
order by 1;

-- Distribución del pipeline
create or replace view public.lead_conversion_view as
select
  coalesce(l.status, 'unknown') as status,
  count(*)::int as count
from public.leads l
where l.dealer_id in (select id from public.dealers where owner_id = auth.uid())
group by 1;
```

> Las vistas deben crearse con `security invoker` (por defecto en Postgres 15+) para que `auth.uid()` sea el del usuario que consulta. En Postgres < 15 usa funciones `security definer` con check explícito.

7. (Opcional) En **Auth → Providers → Email**, desactiva *Confirm email* para que el flujo de registro entre directo a onboarding sin verificación de correo.

> El esquema de la base es la única fuente de verdad. Cualquier campo nuevo (ej. `city`, `email`, etc.) requiere primero un cambio de esquema en Supabase y luego propagarlo a tipos, DTOs, repositorios y servicios. Ver `ARCHITECTURE.md`.

## Scripts

```bash
npm install
npm run dev        # arranca el servidor en http://localhost:5173
npm run build      # build de producción
npm run typecheck  # solo type-check
npm run preview    # previsualiza el build de producción
```

## Flujo de la aplicación

1. El usuario abre la app y puede iniciar sesión o registrarse.
2. **Registro** (`/register`) → Supabase Auth crea el usuario → se crea su `profile` con rol `dealer`.
3. Si el usuario aún no tiene un `dealer`, se le redirige a **Onboarding** (`/onboarding`) para crear su concesionario. Al crearlo, también se actualiza `profiles.dealer_id`.
4. Con el dealer creado, accede al **Dashboard** (`/`) y al resto de la app.
5. Si un usuario sin sesión intenta entrar a una ruta protegida, se redirige a `/login`.
6. Si un usuario autenticado sin dealer accede a rutas internas, se redirige a `/onboarding`.

Estas reglas las implementan:

- `AuthGuard` en `src/app/routes/AuthGuard.tsx`
- `DealerGuard` en `src/shared/guards/DealerGuard.tsx`

## Estructura del proyecto

```
src/
  app/
    layout/                       # AppLayout, Sidebar, Topbar
    routes/                       # AppRoutes, AuthGuard, paths
    queryClient.ts                # React Query client
    theme.ts                      # tema MUI
    App.tsx
  features/
    auth/
      components/                 # AuthCardShell
      context/                    # AuthProvider (sesión, profile, dealer)
      services/                   # authService, profileService
      utils/                      # validation
      pages/                      # LoginPage, RegisterPage
    onboarding/
      types/                      # CreateDealerDto + validación
      hooks/                      # useDealerOnboarding
      services/                   # dealerService (usa dealerRepository)
      pages/                      # DealerOnboardingPage
    dashboard/
      services/                   # dashboardService (lee vistas SQL)
      hooks/                      # useDashboardStats
      components/                 # RecentLeadsList, PipelineSnapshot
      pages/                      # DashboardPage
    vehicles/
      services/                   # vehicleService (CRUD + uploads)
      hooks/                      # useVehicles, useVehicle, useVehicleMutations, useVehicleForm
      components/                 # VehicleCard, VehicleForm, ImageUploader, VehicleFilters, AdGeneratorDialog
      pages/                      # VehiclesListPage, VehicleCreatePage, VehicleEditPage, PublicVehiclePage
    leads/
      services/                   # leadService (CRUD + notes + messages)
      hooks/                      # useLeads, useLead, useLeadMutations
      components/                 # LeadInbox, LeadConversation, LeadSidePanel
      pages/                      # LeadsInboxPage
    sales/
      services/                   # salesService
      hooks/                      # useSales
      components/                 # MonthlyChart
      pages/                      # SalesPage
  shared/
    guards/                       # DealerGuard
    components/                   # PageHeader, StatusChip, KpiCard, EmptyState, LoadingState, ConfirmDialog
    hooks/                        # useToast
    repositories/                 # ÚNICA capa que habla con Supabase
      vehicleRepository.ts
      vehicleImageRepository.ts
      leadRepository.ts
      leadNoteRepository.ts
      leadMessageRepository.ts
      salesRepository.ts
      dashboardRepository.ts      # lee dealer_stats_view, monthly_sales_view, lead_conversion_view
      dealerRepository.ts
      storageRepository.ts        # upload + getPublicUrl
      rowMappers.ts               # mapeo row ↔ tipo de dominio
    services/                     # adGeneratorService (mock UI), supabase client
    types/                        # Vehicle, VehicleImage, Lead, Sale, Profile, Dealer, DealerStats
    queryKeys.ts                  # claves canónicas de React Query
    utils/                        # format
  main.tsx                        # bootstrap (ThemeProvider, QueryClientProvider, AuthProvider, Router)
```

## Decisiones de arquitectura

- **Separación estricta de capas.** Componentes → Hooks → Services → Repositories → Supabase. Ningún componente importa `supabase` directamente.
- **React Query** maneja cache, refetch, paginación y mutaciones. Las claves viven en `src/shared/queryKeys.ts` para invalidación consistente.
- **RLS-first.** No se filtra por `dealer_id` en `SELECT`; las políticas de Supabase deciden qué ve cada dealer. En `INSERT` sí se envía `dealer_id` porque el row lo necesita y `WITH CHECK` valida que coincida con el usuario.
- **Imágenes**: las subidas van a Storage; la fila en `vehicle_images` guarda `storage_path` (verdad) y `url` (cache; el campo es NOT NULL en la tabla). Para mostrar imágenes el frontend siempre regenera la URL con `getPublicUrl(storage_path)`.
- **Dashboard sin agregación en frontend.** El backend expone 3 vistas y la app las lee. Las métricas nunca se calculan en JS.
- **Servicios `*Service`** combinan repositorios cuando hace falta (por ejemplo, `vehicleService.listWithImages` une `vehicleRepository` + `vehicleImageRepository`).

## Estilo de código

- Comillas simples siempre, *template literals* para interpolación.
- Sin punto y coma al final de las sentencias.
- Funciones pequeñas y nombres explícitos.
- Comentarios solo donde explican intención no obvia.
