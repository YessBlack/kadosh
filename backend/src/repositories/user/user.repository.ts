import PocketBase, { RecordModel } from 'pocketbase'
import { IUserRepository } from '@/types/user/user/user.repository.type'
import { extractPocketBaseValidationMessage, isPocketBaseEmailNotUniqueError, isPocketBaseError } from '@/utils/pocketbase.error'
import { CreateUserInput, UpdateUserInput, User } from '@/types/user/user/user.type'
import { AppError } from '@/utils/app-error'
import { mapPocketBaseUser } from '@/repositories/user/user.mapper'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'

export class UserRepository implements IUserRepository {
  private readonly pb: PocketBase

  constructor (createClient: PocketBaseClientFactory) {
    this.pb = createClient()
  }

  async findAll (): Promise<User[]> {
    const records = await this.pb.collection('users').getFullList({ filter: 'isDeleted=false' })
    return records.map(record => this.toUser(record))
  }

  async findById (id: string): Promise<User | null> {
    try {
      const record = await this.pb.collection('users').getOne(id)
      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        return null
      }

      throw error
    }
  }

  async findByEmail (email: string): Promise<User | null> {
    const record = await this.findRecordByEmail(email)
    return record ? this.toUser(record) : null
  }

  async create (input: CreateUserInput): Promise<User> {
    try {
      const record = await this.pb.collection('users').create({
        ...input,
        emailVisibility: true,
        avatar: '',
        isDeleted: false
      })
      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseEmailNotUniqueError(error)) {
        throw new AppError('USER_ALREADY_EXISTS', 'User already exists', error)
      }
      throw error
    }
  }

  async update (id: string, input: UpdateUserInput): Promise<User> {
    try {
      const record = await this.pb.collection('users').update(id, input)
      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new AppError('USER_NOT_FOUND', 'User not found', error)
      }
      const validationMessage = extractPocketBaseValidationMessage(error)
      if (validationMessage) {
        throw new AppError('VALIDATION_ERROR', validationMessage, error)
      }
      throw error
    }
  }

  async updateAvatar (id: string, file: Blob, fileName: string): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file, fileName)

    try {
      const record = await this.pb.collection('users').update(id, formData)
      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new AppError('USER_NOT_FOUND', 'User not found', error)
      }
      const validationMessage = extractPocketBaseValidationMessage(error)
      if (validationMessage) {
        throw new AppError('VALIDATION_ERROR', validationMessage, error)
      }
      throw error
    }
  }

  async delete (id: string): Promise<void> {
    try {
      await this.pb.collection('users').delete(id)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new AppError('USER_NOT_FOUND', 'User not found', error)
      }
      throw error
    }
  }

  private async findRecordByEmail (email: string): Promise<RecordModel | null> {
    try {
      return await this.pb.collection('users').getFirstListItem(`email="${email}"`)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        return null
      }

      throw error
    }
  }

  private toUser (record: RecordModel): User {
    return mapPocketBaseUser(record, this.pb.files.getURL(record, record.avatar))
  }
}
