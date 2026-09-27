interface PocketBaseError {
  status: number
  message?: string
  response?: unknown
}

export const isPocketBaseError = (error: unknown): error is PocketBaseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
  )
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

export const isPocketBaseEmailNotUniqueError = (error: unknown): boolean => {
  if (!isPocketBaseError(error) || error.status !== 400 || !isRecord(error.response)) {
    return false
  }

  const data = error.response.data
  if (!isRecord(data)) return false

  const emailError = data.email
  if (!isRecord(emailError)) return false

  return emailError.code === 'validation_not_unique'
}
