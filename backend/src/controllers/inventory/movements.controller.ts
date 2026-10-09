import { movementSchema, updateMovementSchema } from '@/schemas/inventory/movement.schema'
import { IInventoryMovementService } from '@/types/inventory/movement.service.type'
import { sendValidationError } from '@/utils/validation.utils'
import { NextFunction, Request, Response } from 'express'

const normalizeMovementDate = (body: unknown): unknown => {
  if (typeof body !== 'object' || body === null || !('date' in body) || typeof body.date !== 'string') {
    return body
  }

  return { ...body, date: new Date(body.date) }
}

export class InventoryMovementController {
  private readonly service: IInventoryMovementService

  constructor (service: IInventoryMovementService) {
    this.service = service
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getAllMovements()
      res.status(200).json(items)
    } catch (error: unknown) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const item = await this.service.getMovementById(id)
      res.status(200).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = movementSchema.safeParse(normalizeMovementDate(req.body))

      if (!result.success) return sendValidationError(res, result.error)
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      if (result.data.createdBy !== req.user.id) {
        res.status(403).json({ message: 'createdBy must match the authenticated user' })
        return
      }

      const item = await this.service.createMovement(result.data)
      res.status(201).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = updateMovementSchema.safeParse(normalizeMovementDate(req.body))

      if (!result.success) return sendValidationError(res, result.error)

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const item = await this.service.updateMovement(id, result.data)
      res.status(200).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await this.service.deleteMovement(id)
      res.status(204).send()
    } catch (error: unknown) {
      next(error)
    }
  }
}
