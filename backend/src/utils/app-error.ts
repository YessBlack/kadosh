export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INTERNAL: 'INTERNAL'
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

export const ERROR_STATUS: Record<ErrorCode, number> = {
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.INVALID_FILE_TYPE]: 400,
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.FILE_TOO_LARGE]: 413,
  [ERROR_CODES.INTERNAL]: 500
}
export class AppError extends Error {
  readonly statusCode: number
  readonly cause?: unknown
  constructor (
    readonly code: ErrorCode,
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = ERROR_STATUS[code]
    this.cause = options?.cause
  }
}
