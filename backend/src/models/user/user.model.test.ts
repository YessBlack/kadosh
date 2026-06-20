import { mockCreate, mockDelete, mockGetFirstListItem, mockGetFullList, mockGetOne, mockUpdate } from '@/__mocks__/pocketbase'
import { UserModel } from '@/models/user/user.model'
import { CreateUserInput, UpdateUserInput } from '@/types/user/user.type'

describe('UserModel', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('getAll', () => {
    it('should return a list of users', async () => {
      const mockRecords = [
        { id: '1', email: 'test@test.com', name: 'John', lastname: 'Doe' }
      ]

      mockGetFullList.mockResolvedValue(mockRecords)

      const model = new UserModel()
      const result = await model.getAll()

      expect(result[0].email).toBe('test@test.com')
    })

    it('should throw an error if PocketBase throws', async () => {
      mockGetFullList.mockRejectedValue(new Error('PocketBase error'))

      const model = new UserModel()
      await expect(model.getAll()).rejects.toThrow('Server error')
    })
  })

  describe('getById', () => {
    it('should return a user by id', async () => {
      const mockRecord = { id: '1', email: 'test@test.com', name: 'John', lastname: 'Doe' }
      mockGetOne.mockResolvedValue(mockRecord)

      const model = new UserModel()
      const result = await model.getById('1')

      expect(result.email).toBe('test@test.com')
    })

    it('should throw "User not found" if PocketBase returns 404', async () => {
      const error = new Error('Not found') as unknown as { status: number }
      error.status = 404
      mockGetOne.mockRejectedValue(error)

      const model = new UserModel()
      await expect(model.getById('999')).rejects.toThrow('User not found')
    })

    it('should throw "Server error" for non-404 errors', async () => {
      mockGetOne.mockRejectedValue(new Error('db error'))
      const model = new UserModel()
      await expect(model.getById('1')).rejects.toThrow('Server error')
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const input = { email: 'test@test.com', name: 'John', lastname: 'Doe' }
      const mockRecord = { id: '1', ...input, avatar: '' }

      mockGetFirstListItem.mockRejectedValue(new Error('Not found'))
      mockCreate.mockResolvedValue(mockRecord)

      const model = new UserModel()
      const result = await model.create(input as CreateUserInput)

      expect(result.id).toBe('1')
      expect(result.email).toBe('test@test.com')
    })

    it('should throw "User already exists" if email is taken', async () => {
      const input = { email: 'test@test.com', name: 'John', lastname: 'Doe' }
      mockGetFirstListItem.mockResolvedValue({ id: '1', ...input })

      const model = new UserModel()
      await expect(model.create(input as CreateUserInput)).rejects.toThrow('User already exists')
    })

    it('should throw "Server error" for other PocketBase errors', async () => {
      const input = { email: 'test@test.com', name: 'John', lastname: 'Doe' }

      mockGetFirstListItem.mockRejectedValue(new Error('Not found'))
      mockCreate.mockRejectedValue(new Error('db error'))

      const model = new UserModel()
      await expect(model.create(input as CreateUserInput)).rejects.toThrow('Server error')
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const input = {
        email: 'test@test.com',
        name: 'John',
        lastname: 'Doe'
      }

      const mockRecord = { id: '1', ...input, avatar: '' }
      mockUpdate.mockResolvedValue(mockRecord)

      const model = new UserModel()
      const result = await model.update('1', input)

      expect(result.id).toBe('1')
      expect(result.name).toBe('John')
    })

    it('should throw "User not found" if PocketBase returns 404', async () => {
      const input = { name: 'John', lastname: 'Doe', email: 'test@test.com' }
      const error = new Error('Not found') as unknown as { status: number }
      error.status = 404
      mockUpdate.mockRejectedValue(error)

      const model = new UserModel()
      await expect(model.update('999', input)).rejects.toThrow('User not found')
    })

    it('should throw "Server error" for non-404 errors', async () => {
      mockUpdate.mockRejectedValue(new Error('db error'))
      const model = new UserModel()
      await expect(model.update('1', {} as UpdateUserInput)).rejects.toThrow('Server error')
    })
  })

  describe('delete', () => {
    it('should delete an existing user', async () => {
      mockGetOne.mockResolvedValue({ id: '1', email: 'test@test.com' })
      mockDelete.mockResolvedValue(undefined)

      const model = new UserModel()
      await model.delete('1')
    })

    it('should throw "User not found" if PocketBase returns 404', async () => {
      const error = new Error('Not found') as unknown as { status: number }
      error.status = 404
      mockDelete.mockRejectedValue(error)

      const model = new UserModel()
      await expect(model.delete('999')).rejects.toThrow('User not found')
    })

    it('should throw "Server error" for non-404 errors', async () => {
      mockDelete.mockRejectedValue(new Error('db error'))
      const model = new UserModel()
      await expect(model.delete('1')).rejects.toThrow('Server error')
    })
  })
})
