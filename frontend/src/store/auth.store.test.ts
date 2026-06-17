import { authApi } from '@/features/auth/api/auth.api'
import type { User } from '@/features/auth/types/auth.types'
import { useAuthStore } from '@/store/auth.store'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, vi, it, expect } from 'vitest'

vi.mock('@/features/auth/api/auth.api')

const mockAuthApi = vi.mocked(authApi)

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isInitializing: true
    })
  })

  describe('initialize', () => {
    it('should set isAuthenticated true when authApi.me succeeds', async () => {
      const fakeUser = { id: '1', email: 'test@test.com', name: 'Test' } as User
      mockAuthApi.me.mockResolvedValue(fakeUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.initialize()
      })

      expect(result.current.user).toEqual(fakeUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isInitializing).toBe(false)
    })

    it('should set isAuthenticated false when authApi.me fails', async () => {
      mockAuthApi.me.mockRejectedValue(new Error('No session'))
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.initialize()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isInitializing).toBe(false)
    })
  })

  describe('login', () => {
    it('should set user and isAuthenticated true on successful login', async () => {
      const fakeUser = { id: '1', email: 'test@test.com', name: 'Test' } as User
      mockAuthApi.me.mockResolvedValue(fakeUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: '123456' })
      })

      expect(mockAuthApi.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' })
      expect(result.current.user).toEqual(fakeUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should throw and not change state when login fails', async () => {
      mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'))

      const { result } = renderHook(() => useAuthStore())

      const res = act(async () => {
        await result.current.login({ email: 'wrong@test.com', password: 'wrong' })
      })

      await expect(res).rejects.toThrow('Invalid credentials')
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user and isAuthenticated on successful logout', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@test.com', name: 'Test' } as User,
        isAuthenticated: true,
        isInitializing: false
      })

      mockAuthApi.logout.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear state and rethrow when logout API fails', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@test.com', name: 'Test' } as User,
        isAuthenticated: true,
        isInitializing: false
      })

      mockAuthApi.logout.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useAuthStore())

      const res = act(async () => { await result.current.logout()})

      expect(res).rejects.toThrow('Network error')
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
