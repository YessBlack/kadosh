import { IAuthService } from '@/types/user/auth/auth.service.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'
import { Request, Response, NextFunction } from 'express'

export function createAuthMiddleware (authService: IAuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const { user } = await authService.me(token)

      if (!user.isActive) {
        res.status(403).json({ message: 'Account is inactive' })
        return
      }

      req.user = user
      next()
    } catch (error: unknown) {
      if (error instanceof AppError && error.code === ERROR_CODES.UNAUTHORIZED) {
        res.status(403).json({ message: error.message })
        return
      }

      res.status(401).json({ message: 'Unauthorized' })
    }
  }
}
