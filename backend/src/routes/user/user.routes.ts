import { UserController } from '@/controllers/user/user.controller'
import { IUserModel } from '@/types/user/user.type'
import { Router } from 'express'

interface UserRoutesDeps {
  userModel: IUserModel
}

export const createUserRouter = ({ userModel }: UserRoutesDeps) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get('/', userController.getAll)
  userRouter.get('/:id', userController.getById)
  userRouter.post('/', userController.create)
  userRouter.patch('/:id', userController.update)
  userRouter.delete('/:id', userController.delete)

  return userRouter
}
