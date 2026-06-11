import { Request, Response } from 'express'
import { validateLogin } from '@/schemas/user/auth.schema'
import { IAuthModel } from '@/types/user/auth.type'

interface AuthControllerDeps {
  authModel: IAuthModel
}

export class AuthController {
  private authModel: IAuthModel

  constructor ({ authModel }: AuthControllerDeps) {
    this.authModel = authModel
  }

  login = async (req: Request, res: Response) => {
    const result = validateLogin(req.body)

    if (!result.success) {
      res.status(400).json({ error: result.error.issues })
      return
    }

    try {
      const response = await this.authModel.login(result.data)
      res.status(200).json(response)
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  }

  logout = async (req: Request, res: Response) => {
    await this.authModel.logout()
    res.status(200).json({ message: 'Logout successful' })
  }
}
