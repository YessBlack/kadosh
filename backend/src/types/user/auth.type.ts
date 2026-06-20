import { loginSchema } from '@/schemas/user/auth.schema'
import { User } from '@/types/user/user.type'
import { z } from 'zod'

export type LoginInput = z.infer<typeof loginSchema>

export type AuthResponse = {
  token: string
  user: User
}

export interface IAuthModel {
  login: ({ email, password }: LoginInput) => Promise<AuthResponse>
  logout: () => Promise<void>
  me: (token: string) => Promise<AuthResponse>
}
