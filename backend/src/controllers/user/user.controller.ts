import { NextFunction, Request, Response } from 'express'
import { createUserSchema, updateUserSchema } from '@/schemas/user/user.schema'
import { IUserService } from '@/types/user/user.service.type'
import { sendValidationError } from '@/utils/validation.utils'

interface UserControllerDeps {
  userService: IUserService
}

export class UserController {
  private readonly userService: IUserService

  constructor ({ userService }: UserControllerDeps) {
    this.userService = userService
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll()
      res.status(200).json(users)
    } catch (error: unknown) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const user = await this.userService.getById(id)
      res.status(200).json(user)
    } catch (error: unknown) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body)
    if (!result.success) return sendValidationError(res, result.error)

    try {
      const user = await this.userService.create(result.data)
      res.status(201).json(user)
    } catch (error: unknown) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const result = updateUserSchema.safeParse(req.body)
    if (!result.success) return sendValidationError(res, result.error)

    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const user = await this.userService.update(id, result.data)
      res.status(200).json(user)
    } catch (error: unknown) {
      next(error)
    }
  }

  updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    try {
      const file = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype })
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const user = await this.userService.updateAvatar(id, file)
      res.status(200).json(user)
    } catch (error: unknown) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await this.userService.delete(id)
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error: unknown) {
      next(error)
    }
  }
}
