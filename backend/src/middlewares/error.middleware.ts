import { AppError } from '@/utils/app-error'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'
import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

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

    res.status(error.statusCode).json({ message: error.message })
    return
  }

  console.error({ ...requestContext, error }, 'Unhandled request error')
  res.status(500).json({ message: 'Server error' })
}
