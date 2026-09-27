import { Router } from 'express'
import { UserController } from '@/controllers/user/user.controller'
import { uploadSingle } from '@/middlewares/upload'

interface UserRouterDeps {
  userController: UserController
}

export const createUserRouter = ({ userController }: UserRouterDeps): Router => {
  const router = Router()

  router.get('/', userController.getAll)
  router.get('/:id', userController.getById)
  router.post('/', userController.create)
  router.patch('/:id', userController.update)
  router.delete('/:id', userController.delete)
  router.patch('/:id/avatar', uploadSingle('avatar'), userController.updateAvatar)

  return router
}
