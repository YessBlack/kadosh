import { createPocketBaseClient } from '@/config/pocketbase'
import { AuthController } from '@/controllers/user/auth.controller'
import { AuthRepository } from '@/repositories/user/auth.repository'
import { AuthService } from '@/services/user/auth.service'

const authRepository = new AuthRepository(createPocketBaseClient)
const authService = new AuthService(authRepository)

export const authController = new AuthController({ authService })
