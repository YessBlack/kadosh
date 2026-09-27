import { userApi } from '@/features/users/api/user.api'
import api from '@/lib/axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/axios')

const mockApi = vi.mocked(api)

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      mockApi.get.mockResolvedValue({ data: [] })

      const result = await userApi.getAllUsers()

      expect(result).toEqual([])
      expect(mockApi.get).toHaveBeenCalledWith('users')
    })
  })

  describe('getUserById', () => {
    it('should return the user for the given id', async () => {
      const user = {
        id: '1',
        name: 'John',
        lastname: 'Doe'
      }

      mockApi.get.mockResolvedValue({ data: user })

      const result = await userApi.getUserById('1')

      expect(mockApi.get).toHaveBeenCalledWith('users/1')
      expect(result).toEqual(user)
    })
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John',
        lastname: 'Doe'
      }

      mockApi.post.mockResolvedValue({
        data: { id: '1', ...user }
      })

      const result = await userApi.createUser(user)

      expect(mockApi.post).toHaveBeenCalledWith('users', user)
      expect(result).toEqual({ id: '1', ...user })
    })
  })

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = {
        name: 'John',
        lastname: 'Doe'
      }

      mockApi.patch.mockResolvedValue({
        data: { id: '1', ...user }
      })

      const result = await userApi.updateUser('1', user)

      expect(mockApi.patch).toHaveBeenCalledWith('users/1', user)
      expect(result).toEqual({ id: '1', ...user })
    })
  })

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockApi.delete.mockResolvedValue({
        data: true
      })

      const result = await userApi.deleteUser('1')

      expect(mockApi.delete).toHaveBeenCalledWith('users/1')
      expect(result).toBe(true)
    })
  })
})
