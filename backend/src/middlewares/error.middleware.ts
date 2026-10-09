import { AppError } from '@/utils/app-error'
import { isPocketBaseError } from '@/utils/pocketbase.error'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'
import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

const MAX_AVATAR_SIZE_MB = MAX_AVATAR_SIZE_BYTES / (1024 * 1024)

const getCauseDetails = (cause: unknown): unknown => {
  if (isPocketBaseError(cause)) {
    return {
      message: cause.message,
      status: cause.status,
      response: cause.response
    }
  }

  if (cause instanceof Error) {
    return { name: cause.name, message: cause.message }
  }

  return cause
}

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
    const cause = error.cause === undefined ? undefined : getCauseDetails(error.cause)
    console.warn({
      ...requestContext,
      code: error.code,
      message: error.message,
      cause
    }, 'Application request error')

    const responseBody: { message: string, cause?: unknown } = { message: error.message }
    if (process.env.NODE_ENV !== 'production' && cause !== undefined) responseBody.cause = cause

    res.status(error.statusCode).json(responseBody)
    return
  }

  console.error({ ...requestContext, error }, 'Unhandled request error')
  res.status(500).json({ message: 'Server error' })
}
