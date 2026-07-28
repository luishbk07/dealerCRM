import { useEffect } from 'react'

const DEFAULT_TITLE = 'Dealer CRM'
const DEFAULT_DESCRIPTION =
  'Dealer CRM - Plataforma para concesionarios de vehículos en República Dominicana'

export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    const hadMeta = Boolean(meta)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }

    const previousContent = meta.getAttribute('content')
    meta.setAttribute('content', description)

    return () => {
      document.title = DEFAULT_TITLE
      if (hadMeta && meta) {
        meta.setAttribute('content', previousContent ?? DEFAULT_DESCRIPTION)
      } else if (meta) {
        meta.remove()
      }
    }
  }, [title, description])
}
