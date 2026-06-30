import { Request, Response } from 'express'
import { IUserModel } from '@/types/user/user.type'
import { validateCreateUser, validateUpdateUser } from '@/schemas/user/user.schema'
import { sendValidationError } from '@/utils/validation.utils'

interface UserControllerDeps {
  userModel: IUserModel
}

export class UserController {
  private userModel: IUserModel

  constructor ({ userModel }: UserControllerDeps) {
    this.userModel = userModel
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.userModel.getAll()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: { message: 'Error fetching users' } })
    }
  }

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    try {
      const user = await this.userModel.getById(id)
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: { message: 'User not found' } })
        return
      }
      res.status(500).json({ error: { message: 'Error fetching user' } })
    }
  }

  create = async (req: Request, res: Response) => {
    const result = validateCreateUser(req.body)

    if (!result.success) return sendValidationError(res, result.error)

    try {
      const user = await this.userModel.create(result.data)
      res.status(201).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({ error: { message: 'User already exists' } })
        return
      }
      res.status(500).json({ error: { message: 'Error creating user' } })
    }
  }

  update = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const result = validateUpdateUser(req.body)

    if (!result.success) return sendValidationError(res, result.error)

    try {
      const user = await this.userModel.update(id, result.data)
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: { message: 'User not found' } })
        return
      }
      res.status(500).json({ error: { message: 'Error updating user' } })
    }
  }

  updateAvatar = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const file = req.file
      ? new Blob([req.file.buffer as unknown as ArrayBuffer], { type: req.file.mimetype })
      : null

    if (!file) {
      return res.status(400).json({ error: { message: 'No file provided' } })
    }

    try {
      const user = await this.userModel.updateAvatar(id, file)
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: { message: 'User not found' } })
        return
      }
      res.status(500).json({ error: { message: 'Error updating user' } })
    }
  }

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    try {
      await this.userModel.delete(id)
      res.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: { message: 'User not found' } })
        return
      }
      res.status(500).json({ error: { message: 'Error deleting user' } })
    }
  }
}
