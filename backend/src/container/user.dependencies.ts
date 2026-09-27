import { createPocketBaseClient } from '@/config/pocketbase'
import { UserRepository } from '@/repositories/user/user.repository'
import { UserService } from '@/services/user/user.service'
import { UserController } from '@/controllers/user/user.controller'

const userRepository = new UserRepository(createPocketBaseClient)
const userService = new UserService(userRepository)

export const userController = new UserController({ userService })
