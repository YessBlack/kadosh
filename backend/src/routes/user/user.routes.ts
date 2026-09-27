// routes/user/user.routes.ts
import { Router, RequestHandler } from 'express'
import { UserController } from '@/controllers/user/user.controller'
import { uploadSingle } from '@/middlewares/upload'
import { requireRole, requireSelfOrRole } from '@/middlewares/role.middleware'
import { ROLES } from '@/types/user/role.type'

interface UserRouterDeps {
  userController: UserController
  authMiddleware: RequestHandler
}

export const createUserRouter = ({ userController, authMiddleware }: UserRouterDeps): Router => {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', requireRole(ROLES.ADMIN), userController.getAll)
  router.get('/:id', requireRole(ROLES.ADMIN), userController.getById)
  router.get('/:id/avatar', requireSelfOrRole(ROLES.ADMIN), userController.getAvatar)
  router.post('/', requireRole(ROLES.ADMIN), userController.create)
  router.patch('/:id', requireSelfOrRole(ROLES.ADMIN, ['name', 'lastname', 'phone']), userController.update)
  router.delete('/:id', requireRole(ROLES.ADMIN), userController.delete)
  router.patch('/:id/avatar', requireSelfOrRole(ROLES.ADMIN), uploadSingle('avatar'), userController.updateAvatar)

  return router
}
