import { IAuthRepository } from '@/types/user/auth.repository.type'
import { IAuthService } from '@/types/user/auth.service.type'
import { AuthResponse, ChangePasswordInput, LoginInput } from '@/types/user/auth.type'
import { AppError } from '@/utils/app-error'

export class AuthService implements IAuthService {
  private readonly repo: IAuthRepository

  constructor (repo: IAuthRepository) {
    this.repo = repo
  }

  async login ({ email, password }: LoginInput): Promise<AuthResponse> {
    const session = this.repo.createSession()
    const result = await session.authWithPassword(email, password)
    const user = await session.updateUser(result.user.id, { lastLogin: new Date().toISOString() })

    return { token: result.token, user }
  }

  async me (token: string): Promise<AuthResponse> {
    return this.repo.createSession().authRefresh(token)
  }

  async changePassword (token: string, { currentPassword, newPassword }: ChangePasswordInput): Promise<void> {
    const session = this.repo.createSession()
    const { user } = await session.authRefresh(token)

    try {
      await session.authWithPassword(user.email, currentPassword)
    } catch (error: unknown) {
      if (error instanceof AppError && error.code === 'INVALID_CREDENTIALS') {
        throw new AppError('INVALID_CURRENT_PASSWORD', 'Invalid current password', error)
      }
      throw error
    }

    await session.updateUser(user.id, {
      password: newPassword,
      passwordConfirm: newPassword,
      oldPassword: currentPassword
    })
  }
}
