import { loginSchema } from '@/schemas/user/auth.schema'
import { z } from 'zod'

export type LoginInput = z.infer<typeof loginSchema>

export type AuthUser = {
  id: string
  email: string
  name: string
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export interface IAuthModel {
  login: ({ email, password }: LoginInput) => Promise<AuthResponse>
  logout: () => Promise<void>
}
