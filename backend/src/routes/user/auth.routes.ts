import { AuthController } from '@/controllers/user/auth.controller'
import { Router } from 'express'

interface AuthRouterDeps {
  authController: AuthController
}

export const createAuthRouter = ({ authController }: AuthRouterDeps): Router => {
  const router = Router()

  router.post('/login', authController.login)
  router.post('/logout', authController.logout)
  router.get('/me', authController.me)
  router.post('/change-password', authController.changePassword)

  return router
}
