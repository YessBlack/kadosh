interface PocketBaseError {
  status: number
  message: string
}

export const isPocketBaseError = (error: unknown): error is PocketBaseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error
  )
}
