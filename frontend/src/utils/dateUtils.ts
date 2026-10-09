export const formatDate = (date: string | boolean | number | undefined | Date) => {
  if (!date || typeof date !== 'string') return '—'
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export const formatDateOnly = (date: string | Date | undefined) => {
  if (!date) return '—'

  const calendarDate = typeof date === 'string'
    ? date.slice(0, 10)
    : date.toISOString().slice(0, 10)

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${calendarDate}T00:00:00.000Z`))
}
