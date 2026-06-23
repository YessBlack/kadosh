import { Response } from 'express'
import { ZodError } from 'zod'

export const sendValidationError = (res: Response, error: ZodError) => {
  res.status(400).json({
    error: error.issues.map(i => ({
      field: i.path[0],
      message: i.message
    }))
  })
}
