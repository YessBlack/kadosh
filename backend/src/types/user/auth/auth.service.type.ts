import { AuthResponse, ChangePasswordInput, LoginInput } from '@/types/user/auth/auth.type'

export interface IAuthService {
  login: (input: LoginInput) => Promise<AuthResponse>
  me: (token: string) => Promise<AuthResponse>
  changePassword: (token: string, input: ChangePasswordInput) => Promise<void>
}
