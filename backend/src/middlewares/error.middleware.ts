import { AppError } from '@/utils/app-error'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'
import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

const HTTP_STATUS_BY_ERROR_CODE = {
  INVALID_CREDENTIALS: 401,
  INVALID_SESSION: 401,
  INVALID_CURRENT_PASSWORD: 401,
  ACCOUNT_INACTIVE: 403,
  USER_NOT_FOUND: 404,
  USER_ALREADY_EXISTS: 409,
  INVALID_FILE_TYPE: 400,
  FILE_TOO_LARGE: 400,
  VALIDATION_ERROR: 400
} as const

const MAX_AVATAR_SIZE_MB = MAX_AVATAR_SIZE_BYTES / (1024 * 1024)

export function errorMiddleware (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ message: `La imagen supera el límite de ${MAX_AVATAR_SIZE_MB} MB` })
      return
    }

    res.status(400).json({ message: error.message })
    return
  }

  const requestContext = {
    method: req.method,
    path: req.originalUrl
  }

  if (error instanceof AppError) {
    console.warn({
      ...requestContext,
      code: error.code,
      message: error.message,
      cause: error.cause
    }, 'Application request error')

    res.status(HTTP_STATUS_BY_ERROR_CODE[error.code]).json({ message: error.message })
    return
  }

  console.error({ ...requestContext, error }, 'Unhandled request error')
  res.status(500).json({ message: 'Server error' })
}
