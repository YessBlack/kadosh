import { mockAuthWithPassword, mockClear, mockGetURL } from '@/__mocks__/pocketbase'
import { AuthModel } from './auth.model'

describe('AuthModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should login with valid credentials', async () => {
    mockGetURL.mockReturnValue('avatar-url')
    mockAuthWithPassword.mockResolvedValue({
      token: 'fake-token',
      record: {
        id: 'user-id',
        email: 'test@test.com',
        name: 'Test User',
        lastname: 'User',
        avatar: 'avatar-url',
        isDeleted: false
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
    expect(result.user.lastname).toBe('User')
    expect(result.user.avatar).toBe('avatar-url')
    expect(result.user.isDeleted).toBe(false)
  })

  it('should throw error with invalid credentials', async () => {
    mockAuthWithPassword.mockRejectedValue(new Error('Invalid credentials'))

    const authModel = new AuthModel()

    const res = authModel.login({ email: 'wrong@test.com', password: 'wrong' })
    await expect(res).rejects.toThrow('Server error')
  })

  it('should logout', async () => {
    const authModel = new AuthModel()
    await authModel.logout()
    expect(mockClear).toHaveBeenCalled()
  })
})
