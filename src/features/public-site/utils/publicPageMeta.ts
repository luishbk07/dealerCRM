export interface PublicPageMetaOptions {
  title: string
  description: string
  imageUrl?: string | null
  url?: string
}

const DEFAULT_TITLE = 'Dealer CRM'
const DEFAULT_DESCRIPTION =
  'Dealer CRM - Plataforma para concesionarios de vehículos en República Dominicana'

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string): (() => void) => {
  const selector = attribute === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
  let element = document.querySelector<HTMLMetaElement>(selector)
  const hadElement = Boolean(element)
  const previousContent = element?.getAttribute('content') ?? null

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)

  return () => {
    if (!element) return
    if (hadElement && previousContent !== null) {
      element.setAttribute('content', previousContent)
    } else {
      element.remove()
    }
  }
}

export const applyPublicPageMeta = (options: PublicPageMetaOptions): (() => void) => {
  const cleanups: Array<() => void> = []
  const previousTitle = document.title

  document.title = options.title
  cleanups.push(() => {
    document.title = previousTitle
  })

  cleanups.push(upsertMeta('name', 'description', options.description))
  cleanups.push(upsertMeta('property', 'og:title', options.title))
  cleanups.push(upsertMeta('property', 'og:description', options.description))
  cleanups.push(upsertMeta('property', 'og:type', 'website'))

  if (options.imageUrl) {
    cleanups.push(upsertMeta('property', 'og:image', options.imageUrl))
  }

  if (options.url) {
    cleanups.push(upsertMeta('property', 'og:url', options.url))
  }

  return () => {
    for (const cleanup of cleanups.reverse()) {
      cleanup()
    }
    document.title = DEFAULT_TITLE
    upsertMeta('name', 'description', DEFAULT_DESCRIPTION)
  }
}

export const buildVehiclePageTitle = (
  brand: string,
  model: string,
  year: number | null,
  dealerName: string
): string => {
  const yearLabel = year ? ` ${year}` : ''
  return `${brand} ${model}${yearLabel} | ${dealerName}`
}

export const buildVehiclePageDescription = (
  brand: string,
  model: string,
  year: number | null,
  dealerName: string
): string => {
  const yearLabel = year ? ` ${year}` : ''
  return `Consulta el ${brand} ${model}${yearLabel} disponible en ${dealerName}. Solicita información o agenda una visita.`
}
