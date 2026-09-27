export type AppErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'INVALID_SESSION'
  | 'INVALID_CURRENT_PASSWORD'
  | 'ACCOUNT_INACTIVE'
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'

export class AppError extends Error {
  public readonly cause?: unknown

  constructor (public readonly code: AppErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'AppError'
    this.cause = cause
  }
}
