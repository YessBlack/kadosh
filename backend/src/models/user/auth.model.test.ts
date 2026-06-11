import { mockAuthWithPassword, mockClear } from '@/__mocks__/pocketbase'
import { AuthModel } from './auth.model'

describe('AuthModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should login with valid credentials', async () => {
    mockAuthWithPassword.mockResolvedValue({
      token: 'fake-token',
      record: {
        id: 'user-id',
        email: 'test@test.com',
        name: 'Test User'
      }
    })

    const authModel = new AuthModel()
    const result = await authModel.login({
      email: 'test@test.com',
      password: '123456'
    })

    expect(result.token).toBe('fake-token')
    expect(result.user.email).toBe('test@test.com')
    expect(result.user.name).toBe('Test User')
  })

  it('should throw error with invalid credentials', async () => {
    mockAuthWithPassword.mockRejectedValue(new Error('Invalid credentials'))

    const authModel = new AuthModel()

    await expect(
      authModel.login({ email: 'wrong@test.com', password: 'wrong' })
    ).rejects.toThrow('Login failed')
  })

  it('should logout', async () => {
    const authModel = new AuthModel()
    await authModel.logout()
    expect(mockClear).toHaveBeenCalled()
  })
})
