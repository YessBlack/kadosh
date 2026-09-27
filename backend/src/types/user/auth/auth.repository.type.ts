import { User } from '@/types/user/user/user.type'

export type AuthUserUpdate = {
  lastLogin?: string
  password?: string
  passwordConfirm?: string
  oldPassword?: string
}

export type AuthResult = {
  token: string
  user: User
}

export interface IAuthSession {
  authWithPassword: (email: string, password: string) => Promise<AuthResult>
  authRefresh: (token: string) => Promise<AuthResult>
  updateUser: (id: string, data: AuthUserUpdate) => Promise<User>
}

export interface IAuthRepository {
  createSession: () => IAuthSession
}
