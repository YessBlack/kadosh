import { authApi } from '@/features/auth/api/auth.api'
import type { LoginData, User } from '@/features/auth/types/auth.types'
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  login: (loginData: LoginData) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    set({ isLoading: true })

    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (credentials: LoginData) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authApi.login(credentials)
      set({ user, isLoading: false })
    } catch {
      set({ error: 'Credenciales inválidas', isLoading: false })
    }
  },

  logout: async () => {
    try {
      await authApi.logout()

      set({
        isAuthenticated: false,
        user: null
      })
    } catch {
      set({ error: 'Error al cerrar sesión' })
    }
  }
}))
