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
- Capa de servicios con interfaces TS (mock + LocalStorage) lista para sustituirse por una API real

## Scripts

```bash
npm install
npm run dev        # arranca el servidor en http://localhost:5173
npm run build      # build de producción
npm run typecheck  # solo type-check
npm run lint       # ESLint
npm run preview    # previsualiza el build de producción
```

## Acceso al demo

En la pantalla de login usa cualquier correo válido y una contraseña con 4 o más caracteres. Los valores precargados sirven para entrar de inmediato.

## Estructura del proyecto

```
src/
  app/                  # composición de la aplicación
    layout/             # AppLayout, Sidebar, Topbar
    routes/             # AppRoutes, ProtectedRoute, paths
    theme.ts            # tema MUI (Inter, paleta SaaS limpia)
    App.tsx             # punto de entrada de la app
  features/             # cada feature es autocontenida
    auth/
      context/          # AuthProvider + useAuth
      pages/            # LoginPage
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
