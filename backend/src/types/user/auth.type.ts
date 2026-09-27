import { changePasswordSchema, loginSchema } from '@/schemas/user/auth.schema'
import { User } from '@/types/user/user.type'
import { z } from 'zod'

// request DTO
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// Response DTO
export type AuthResponse = {
  token: string
  user: User
}
