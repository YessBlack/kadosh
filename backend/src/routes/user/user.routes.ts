// routes/user/user.routes.ts
import { Router, RequestHandler } from 'express'
import { UserController } from '@/controllers/user/user.controller'
import { uploadSingle } from '@/middlewares/upload'
import { requirePermission } from '@/middlewares/permission.middleware'
import { PERMISSIONS } from '@/types/user/permissions/permission.type'

interface UserRouterDeps {
  userController: UserController
  authMiddleware: RequestHandler
}

export const createUserRouter = ({ userController, authMiddleware }: UserRouterDeps): Router => {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', requirePermission(PERMISSIONS.USERS_READ), userController.getAll)
  router.get('/:id', requirePermission(PERMISSIONS.USERS_READ), userController.getById)
  router.post('/', requirePermission(PERMISSIONS.USERS_WRITE), userController.create)
  router.patch('/:id', requirePermission(PERMISSIONS.USERS_WRITE), userController.update)
  router.delete('/:id', requirePermission(PERMISSIONS.USERS_WRITE), userController.delete)
  router.patch('/:id/avatar', requirePermission(PERMISSIONS.USERS_WRITE), uploadSingle('avatar'), userController.updateAvatar)

  return router
}
