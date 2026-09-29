import { updateBusinessSchema } from '@/schemas/business/business.schemas'
import { IBusinessService } from '@/types/business/business.service.type'
import { sendValidationError } from '@/utils/validation.utils'
import { NextFunction, Request, Response } from 'express'

export class BusinessController {
  private readonly service: IBusinessService

  constructor (service: IBusinessService) {
    this.service = service
  }

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const business = await this.service.get()
      res.status(200).json(business)
    } catch (error: unknown) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = updateBusinessSchema.safeParse(req.body)

      if (!result.success) return sendValidationError(res, result.error)

      const business = await this.service.update(result.data)
      res.status(200).json(business)
    } catch (error: unknown) {
      next(error)
    }
  }

  updateLogo = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    try {
      const file = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype })
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const fileName = req.file.originalname || 'logo'
      const business = await this.service.updateLogo(id, file, fileName)
      res.status(200).json(business)
    } catch (error: unknown) {
      next(error)
    }
  }
}
