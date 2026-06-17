import { authApi } from '@/features/auth/api/auth.api'
import type { LoginData, User } from '@/features/auth/types/auth.types'
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  initialize: () => Promise<void>
  login: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  initialize: async () => {
    set({ isInitializing: true })

    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true, isInitializing: false })
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false })
    }
  },

  login: async (credentials: LoginData) => {
    const user = await authApi.login(credentials)
    set({ user, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await authApi.logout()

      set({
        isAuthenticated: false,
        user: null
      })
    } catch (error: unknown) {
      set({
        isAuthenticated: false,
        user: null
      })
      throw error
    }
  }
}))
