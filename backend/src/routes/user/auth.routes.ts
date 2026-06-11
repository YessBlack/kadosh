import { Router } from 'express'
import { AuthController } from '@/controllers/user/auth.controller'
import { IAuthModel } from '@/types/user/auth.type'

interface AuthRouterDeps {
  authModel: IAuthModel
}

export const createAuthRouter = ({ authModel }: AuthRouterDeps) => {
  const authRouter = Router()
  const authController = new AuthController({ authModel })

  authRouter.post('/', authController.login)
  authRouter.post('/', authController.logout)

  return authRouter
}
