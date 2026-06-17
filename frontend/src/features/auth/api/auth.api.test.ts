import { authApi } from '@/features/auth/api/auth.api'
import api from '@/lib/axios'
import { describe, vi, it, beforeEach, expect } from 'vitest'

vi.mock('@/lib/axios')

const mockApi = vi.mocked(api)

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should POST to auth/login with credentials and return user data', async () => {
      const fakeUser = { id: '1', email: 'user@example.com', name: 'Test User' }
      mockApi.post.mockResolvedValue({ data: fakeUser })

      const result = await authApi.login({ email: 'test@test.com', password: '123456' })

      expect(result).toEqual(fakeUser)
      expect(mockApi.post).toHaveBeenCalledWith('auth/login', { email: 'test@test.com', password: '123456' })
    })
  })

  describe('me', () => {
    it('should GET auth/me and return user data', async () => {
      const fakeUser = { id: '1', email: 'user@example.com', name: 'Test User' }
      mockApi.get.mockResolvedValue({ data: fakeUser })

      const result = await authApi.me()

      expect(result).toEqual(fakeUser)
      expect(mockApi.get).toHaveBeenCalledWith('auth/me')
    })
  })

  describe('logout', () => {
    it('should POST to auth/logout', async () => {
      mockApi.post.mockResolvedValue({})
      await authApi.logout()
      expect(mockApi.post).toHaveBeenCalledWith('auth/logout')
    })
  })
})
