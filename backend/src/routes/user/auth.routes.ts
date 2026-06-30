import { Router } from 'express'
import { AuthController } from '@/controllers/user/auth.controller'
import { IAuthModel } from '@/types/user/auth.type'

interface AuthRouterDeps {
  authModel: IAuthModel
}

export const createAuthRouter = ({ authModel }: AuthRouterDeps) => {
  const authRouter = Router()
  const authController = new AuthController({ authModel })

  authRouter.post('/login', authController.login)
  authRouter.post('/logout', authController.logout)
  authRouter.get('/me', authController.me)
  authRouter.post('/changePassword', authController.changePassword)

  return authRouter
}
