import { changePasswordSchema, loginSchema } from '@/schemas/user/auth.schema'
import { User } from '@/types/user/user.type'
import { z } from 'zod'

export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export type AuthResponse = {
  token: string
  user: User
}

export interface IAuthModel {
  login: (input: LoginInput) => Promise<AuthResponse>
  logout: () => Promise<void>
  me: (token: string) => Promise<AuthResponse>
  changePassword: (token: string, input: ChangePasswordInput) => Promise<void>
}
