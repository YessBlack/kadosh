import { IAuthRepository } from '@/types/user/auth/auth.repository.type'
import { IAuthService } from '@/types/user/auth/auth.service.type'
import { AuthResponse, ChangePasswordInput, LoginInput } from '@/types/user/auth/auth.type'
import { User } from '@/types/user/user/user.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

export class AuthService implements IAuthService {
  private readonly repo: IAuthRepository

  constructor (repo: IAuthRepository) {
    this.repo = repo
  }

  async login ({ email, password }: LoginInput): Promise<AuthResponse> {
    const session = this.repo.createSession()
    const result = await session.authWithPassword(email, password)
    this.assertActiveUser(result.user)

    let user = result.user
    try {
      user = await session.updateUser(result.user.id, { lastLogin: new Date().toISOString() })
    } catch (error: unknown) {
      console.warn({ userId: result.user.id, error }, 'Could not update last login')
    }

    return { token: result.token, user }
  }

  async me (token: string): Promise<AuthResponse> {
    const response = await this.repo.createSession().authRefresh(token)
    this.assertActiveUser(response.user)
    return response
  }

  async changePassword (token: string, { currentPassword, newPassword }: ChangePasswordInput): Promise<void> {
    const session = this.repo.createSession()
    const { user } = await session.authRefresh(token)
    this.assertActiveUser(user)

    try {
      await session.authWithPassword(user.email, currentPassword)
    } catch (error: unknown) {
      if (error instanceof AppError && error.code === ERROR_CODES.UNAUTHORIZED) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid current password', error)
      }
      throw error
    }

    await session.updateUser(user.id, {
      password: newPassword,
      passwordConfirm: newPassword,
      oldPassword: currentPassword
    })
  }

  private assertActiveUser (user: User): void {
    if (!user.isActive) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'Account is inactive')
    }
  }
}
