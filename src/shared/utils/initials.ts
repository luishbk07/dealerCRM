export const buildInitials = (name: string | null | undefined): string => {
  if (!name?.trim()) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
