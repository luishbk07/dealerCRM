const sanitizeExtension = (extension: string): string =>
  extension.replace(/^\./, '').toLowerCase() || 'webp'

export const buildDealerLogoStoragePath = (dealerId: string, extension: string): string =>
  `dealers/${dealerId}/logo.${sanitizeExtension(extension)}`

export const buildDealerBannerStoragePath = (dealerId: string, extension: string): string =>
  `dealers/${dealerId}/banner.${sanitizeExtension(extension)}`
