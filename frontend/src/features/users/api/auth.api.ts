import api from '@/lib/axios'
import type { LoginData, User } from '../types/auth.types'

const login = async (data: LoginData): Promise<User> => {
  const response = await api.post<User>('auth/login', data)
  return response.data
}

const me = async (): Promise<User> => {
  const response = await api.get<User>('auth/me')
  return response.data
}

const logout = async (): Promise<void> => {
  await api.post('auth/logout')
}

export const authApi = { login, me, logout }
