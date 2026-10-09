import { itemsSchema, updateItemsSchema } from '@/schemas/inventory/items.schema'
import { IInventoryService } from '@/types/inventory/item.service.type'
import { sendValidationError } from '@/utils/validation.utils'
import { NextFunction, Request, Response } from 'express'

export class InventoryItemController {
  private readonly service: IInventoryService

  constructor (service: IInventoryService) {
    this.service = service
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getAllItems()
      res.status(200).json(items)
    } catch (error: unknown) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const item = await this.service.getItemById(id)
      res.status(200).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : ''
      const items = await this.service.searchProducts(q)
      res.status(200).json(items)
    } catch (error: unknown) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = itemsSchema.safeParse(req.body)

      if (!result.success) return sendValidationError(res, result.error)

      const item = await this.service.createItem(result.data)
      res.status(201).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = updateItemsSchema.safeParse(req.body)

      if (!result.success) return sendValidationError(res, result.error)

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const item = await this.service.updateItem(id, result.data)
      res.status(200).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  updateImage = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    try {
      const file = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype })
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const fileName = req.file.originalname || 'image'
      const item = await this.service.updateItemImage(id, file, fileName)
      res.status(200).json(item)
    } catch (error: unknown) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await this.service.deleteItem(id)
      res.status(204).send()
    } catch (error: unknown) {
      next(error)
    }
  }
}
