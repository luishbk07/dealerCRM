import { useEffect } from 'react'
import { applyPublicPageMeta, type PublicPageMetaOptions } from '../utils/publicPageMeta'

export const usePublicPageMeta = (options: PublicPageMetaOptions | null) => {
  useEffect(() => {
    if (!options) return undefined
    return applyPublicPageMeta(options)
  }, [options])
}
