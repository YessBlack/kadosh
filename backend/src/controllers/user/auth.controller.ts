import { NextFunction, Request, Response } from 'express'
import { validateChangePassword, validateLogin } from '@/schemas/user/auth.schema'
import { IAuthService } from '@/types/user/auth.service.type'
import { sendValidationError } from '@/utils/validation.utils'

interface AuthControllerDeps {
  authService: IAuthService
}

export class AuthController {
  private readonly authService: IAuthService

  constructor ({ authService }: AuthControllerDeps) {
    this.authService = authService
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const result = validateLogin(req.body)

    if (!result.success) return sendValidationError(res, result.error)

    try {
      const response = await this.authService.login(result.data)

      res.cookie('token', response.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      res.status(200).json({ ...response.user })
    } catch (error: unknown) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' })
    res.status(200).json({ message: 'Logged out successfully' })
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const { user } = await this.authService.me(token)
      res.status(200).json({ ...user })
    } catch (error: unknown) {
      next(error)
    }
  }

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const result = validateChangePassword(req.body)

    if (!result.success) return sendValidationError(res, result.error)

    try {
      await this.authService.changePassword(token, result.data)
      res.status(200).json({ message: 'Password updated successfully' })
    } catch (error: unknown) {
      next(error)
    }
  }
}
