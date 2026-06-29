import { Request, Response } from 'express'
import { validateChangePassword, validateLogin } from '@/schemas/user/auth.schema'
import { IAuthModel } from '@/types/user/auth.type'
import { sendValidationError } from '@/utils/validation.utils'

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

      res.cookie('token', response.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      const { user } = response

      res.status(200).json({ ...user })
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }

      res.status(500).json({ message: 'Server error' })
    }
  }

  logout = async (req: Request, res: Response) => {
    const token = req.cookies.token

    if (token) await this.authModel.logout()

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict'
    })

    res.status(200).json({ message: 'Logged out successfully' })
  }

  me = async (req: Request, res: Response) => {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const { user } = await this.authModel.me(token)

      res.status(200).json({ ...user })
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid session') {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      res.status(500).json({ message: 'Server error' })
    }
  }

  changePassword = async (req: Request, res: Response) => {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const result = validateChangePassword(req.body)
    if (!result.success) return sendValidationError(res, result.error)

    try {
      await this.authModel.changePassword(token, result.data)
      res.status(200).json({ message: 'Password updated successfully' })
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid current password') {
        res.status(401).json({ message: 'Invalid current password' })
        return
      }
      res.status(500).json({ message: 'Server error' })
    }
  }
}
