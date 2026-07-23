export const startOfDayIso = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0)
  return date.toISOString()
}

export const endOfDayIso = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1, 23, 59, 59, 999)
  return date.toISOString()
}
