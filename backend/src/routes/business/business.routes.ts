import { BusinessController } from '@/controllers/business/business.controller'
import { requireRole } from '@/middlewares/role.middleware'
import { uploadSingle } from '@/middlewares/upload'
import { ROLES } from '@/types/user/role.type'
import { RequestHandler, Router } from 'express'

interface BusinessRouterDeps {
  businessController: BusinessController
  authMiddleware: RequestHandler
}

export const createBusinessRouter = ({ businessController, authMiddleware }: BusinessRouterDeps) => {
  const router = Router()

  router.get('/', authMiddleware, requireRole(ROLES.ADMIN), businessController.get)
  router.patch('/:id', authMiddleware, requireRole(ROLES.ADMIN), businessController.update)
  router.patch('/:id/logo', authMiddleware, requireRole(ROLES.ADMIN), uploadSingle('logo'), businessController.updateLogo)
  return router
}
