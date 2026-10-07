export const cleanBarcode = (value: string) => value.split(':').pop()?.trim() ?? ''

export const formatPrice = (value: string | number | boolean | undefined) => {
  if (value === undefined || value === null || value === false) return '—'

  const numberValue = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN

  if (!Number.isFinite(numberValue)) return '—'

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numberValue)
}
