import { AppError, ERROR_CODES } from '@/utils/app-error'

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

export const isPocketBaseSkuNotUniqueError = (error: unknown): boolean => {
  if (!isPocketBaseError(error) || error.status !== 400 || !isRecord(error.response)) {
    return false
  }

  const responseData = error.response.data
  if (!isRecord(responseData)) return false

  const data = isRecord(responseData.data) ? responseData.data : responseData
  if (!isRecord(data.sku)) return false

  return data.sku.code === 'validation_not_unique'
}

export const extractPocketBaseValidationMessage = (error: unknown): string | null => {
  if (!isPocketBaseError(error) || error.status !== 400 || !isRecord(error.response)) {
    return null
  }

  const data = error.response.data
  if (!isRecord(data)) return null

  const firstFieldError = Object.values(data).find(isRecord)
  if (!firstFieldError || typeof firstFieldError.message !== 'string') return null

  return firstFieldError.message
}

export function translatePocketBaseError (error: unknown, notFoundMessage: string): unknown {
  if (isPocketBaseError(error) && error.status === 404) {
    return new AppError(ERROR_CODES.NOT_FOUND, notFoundMessage, { cause: error })
  }

  if (isPocketBaseSkuNotUniqueError(error)) {
    return new AppError(ERROR_CODES.VALIDATION_ERROR, 'Ese SKU ya está en uso', { cause: error })
  }

  const validationMessage = extractPocketBaseValidationMessage(error)

  if (validationMessage) {
    return new AppError(ERROR_CODES.VALIDATION_ERROR, validationMessage, { cause: error })
  }

  return error
}
