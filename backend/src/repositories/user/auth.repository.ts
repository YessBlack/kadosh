import PocketBase, { RecordModel } from 'pocketbase'
import { AuthUserUpdate, IAuthRepository, IAuthSession, AuthResult } from '@/types/user/auth/auth.repository.type'
import { User } from '@/types/user/user/user.type'
import { isPocketBaseError } from '@/utils/pocketbase.error'
import { AppError, ERROR_CODES } from '@/utils/app-error'
import { mapPocketBaseUser } from '@/repositories/user/user.mapper'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'

export class AuthRepository implements IAuthRepository {
  private readonly createClient: PocketBaseClientFactory

  constructor (createClient: PocketBaseClientFactory) {
    this.createClient = createClient
  }

  createSession (): IAuthSession {
    return new PocketBaseAuthSession(this.createClient())
  }
}

class PocketBaseAuthSession implements IAuthSession {
  private readonly client: PocketBase

  constructor (client: PocketBase) {
    this.client = client
  }

  async authWithPassword (email: string, password: string): Promise<AuthResult> {
    try {
      const result = await this.client.collection('users').authWithPassword<RecordModel>(email, password)
      return { token: result.token, user: this.toUser(result.record) }
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 400) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials', { cause: error })
      }
      throw error
    }
  }

  async authRefresh (token: string): Promise<AuthResult> {
    this.client.authStore.save(token, null)
    try {
      const result = await this.client.collection('users').authRefresh<RecordModel>()
      return { token: result.token, user: this.toUser(result.record) }
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 401) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid session', { cause: error })
      }
      throw error
    }
  }

  async updateUser (id: string, data: AuthUserUpdate): Promise<User> {
    try {
      const record = await this.client.collection('users').update<RecordModel>(id, data)
      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found', { cause: error })
      }
      throw error
    }
  }

  private toUser (record: RecordModel): User {
    return mapPocketBaseUser(record, this.client.files.getURL(record, record.avatar))
  }
}
