import { AuthService } from '@/services/user/auth.service'
import { ROLES } from '@/types/user/role.type'
import { IAuthRepository, AuthResult } from '@/types/user/auth/auth.repository.type'

const user = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'Test',
  lastname: 'User',
  isActive: true,
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  avatar: '',
  isDeleted: false,
  role: ROLES.ADMIN
}

describe('AuthService', () => {
  it('completes login when the last-login metadata update fails', async () => {
    const authResult: AuthResult = { token: 'session-token', user }
    const session = {
      authWithPassword: jest.fn().mockResolvedValue(authResult),
      authRefresh: jest.fn(),
      updateUser: jest.fn().mockRejectedValue(new Error('PocketBase update failed'))
    }
    const repository = { createSession: jest.fn().mockReturnValue(session) } as unknown as IAuthRepository
    const service = new AuthService(repository)
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    await expect(service.login({ email: user.email, password: 'password123' }))
      .resolves.toEqual(authResult)
    expect(warn).toHaveBeenCalledWith(
      { userId: user.id, error: expect.any(Error) },
      'Could not update last login'
    )
    warn.mockRestore()
  })
})
